import { FSWatcher } from 'chokidar';
import fs from 'fs';
import { Context, Middleware } from 'koa';
import LRUCache from 'lru-cache';
import { promisify } from 'util';
import { Plugin } from '../Plugin';
import { addToCache, tryServeFromCache } from '../response-body-cache';
import { getBodyAsString, isUtf8, RequestCancelledError } from '../utils/utils';

const stat = promisify(fs.stat);

export interface PluginServeMiddlewareConfig {
  plugins: Plugin[];
  fileWatcher: FSWatcher;
  rootDir: string;
  fileExtensions: string[];
  cache: LRUCache<string, CacheEntry> | undefined;
  cacheKeysForFilePaths: Map<String, String> | undefined;
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
  const transformPlugins = cfg.plugins.filter(p => 'transform' in p);
  if (transformPlugins.length === 0) {
    // nothing to transform
    return (ctx, next) => next();
  }

  return async function pluginTransformMiddleware(context, next) {
    let cached = false;
    let cacheKey = '';
    let cachedBody: string | undefined;

    if (cfg.fileWatcher && cfg.cache) {
      const result = await tryServeFromCache(cfg.cache, context);
      ({ cached, cacheKey, cachedBody } = result);
      context = result.context;
    }

    await next();

    if (context.status < 200 || context.status >= 300) {
      return undefined;
    }

    if (cached) {
      context.body = cachedBody;
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
    }

    if (cfg.fileWatcher && transformCache && cfg.cache && cfg.cacheKeysForFilePaths) {
      addToCache({
        cache: cfg.cache,
        cacheKey,
        cacheKeysForFilePaths: cfg.cacheKeysForFilePaths,
        context,
        cfg,
      });
    }
  };
}
