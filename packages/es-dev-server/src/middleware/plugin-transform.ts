import { FSWatcher } from 'chokidar';
import fs from 'fs';
import chalk from 'chalk';
import { Context, Middleware } from 'koa';
import LRUCache from 'lru-cache';
import { promisify } from 'util';
import { Plugin } from '../Plugin';
import { addToCache, createResponseBodyCache, tryServeFromCache } from '../response-body-cache';
import { getBodyAsString, isUtf8, RequestCancelledError } from '../utils/utils';
import stripAnsi from 'strip-ansi';
import { MessageChannel } from '../utils/MessageChannel';

export class TransformSyntaxError extends Error {}

const stat = promisify(fs.stat);

export interface PluginServeMiddlewareConfig {
  plugins: Plugin[];
  fileWatcher: FSWatcher;
  logErrorsToBrowser: boolean;
  messageChannel?: MessageChannel;
  rootDir: string;
  fileExtensions: string[];
}

interface CacheEntry {
  body: string;
  headers: Record<string, string>;
  filePath: string;
  lastModified: number;
}

/**
 * Cache by user agent + file path, so that there can be unique transforms
 * per browser.
 */
function createCacheKey(ctx: Context) {
  return `${ctx.get('user-agent')}${ctx.url}`;
}

async function getLastModified(path: string): Promise<number> {
  try {
    return (await stat(path)).mtimeMs;
  } catch (error) {
    return -1;
  }
}

/**
 * Sets up a middleware which allows plugins to transform files before they are served to the browser.
 */
export function createPluginTransformMiddlware(cfg: PluginServeMiddlewareConfig): Middleware {
  let cache: LRUCache<string, CacheEntry>;
  let cacheKeysForFilePaths: Map<String, String>;
  if (cfg.fileWatcher) {
    ({ cache, cacheKeysForFilePaths } = createResponseBodyCache(cfg, cfg.fileWatcher));
  }

  const transformPlugins = cfg.plugins.filter(p => 'transform' in p);
  if (transformPlugins.length === 0) {
    // nothing to transform
    return (ctx, next) => next();
  }

  return async function pluginTransformMiddleware(context, next) {
    let cached = false;
    let cacheKey = '';
    let cachedBody: string | undefined;

    if (cfg.fileWatcher && cache) {
      const result = await tryServeFromCache(cache, context);
      ({ cached, cacheKey, cachedBody } = result);
    }

    if (cached) {
      context.body = cachedBody;
      return undefined;
    }

    await next();

    if (context.status < 200 || context.status >= 300) {
      return undefined;
    }

    if (!isUtf8(context)) {
      return undefined;
    }

    // responses are streams initially, but to allow transforming we turn it
    // into a string first
    try {
      context.body = await getBodyAsString(context);
    } catch (error) {
      if (error instanceof RequestCancelledError) {
        return undefined;
      }
      return undefined;
    }

    let transformCache = true;
    for (const plugin of transformPlugins) {
      try {
        const response = await plugin.transform?.(context);
        if (response) {
          transformCache = response.transformCache === false ? false : transformCache;
          if (response.body != null) {
            context.body = response.body;
          }

          if (response.headers) {
            for (const [k, v] of Object.entries(response.headers)) {
              context.response.set(k, v);
            }
          }
        }
      } catch (error) {
        if (error instanceof TransformSyntaxError) {
          const errorMessage = error.message.replace(`${process.cwd()}/`, '');
          context.status = 500;
          console.error(`Syntax error: ${errorMessage}`);

          if (cfg.logErrorsToBrowser) {
            cfg.messageChannel?.sendMessage({
              name: 'error-message',
              data: JSON.stringify(stripAnsi(errorMessage)),
            });
          }
          return;
        }
        throw error;
      }
    }

    if (cfg.fileWatcher && transformCache) {
      addToCache({
        cache,
        cacheKey,
        cacheKeysForFilePaths,
        context,
        cfg,
      });
    }
  };
}
