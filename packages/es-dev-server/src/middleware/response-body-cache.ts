/* eslint-disable no-restricted-syntax */
import LRUCache from 'lru-cache';
import fs from 'fs';
import { Context, Middleware } from 'koa';
import { FSWatcher } from 'chokidar';
import { promisify } from 'util';
import {
  getBodyAsString,
  getRequestFilePath,
  isGeneratedFile,
  RequestCancelledError,
  logDebug,
} from '../utils/utils';

const stat = promisify(fs.stat);

interface ResponseBodyCacheMiddleware {
  fileWatcher: FSWatcher;
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
 * Returns 304 response for cacheable requests if etag matches
 */
export function createResponseBodyCacheMiddleware(cfg: ResponseBodyCacheMiddleware): Middleware {
  /** @type {Map<String, String>} */
  const cacheKeysForFilePaths = new Map();

  const cache = new LRUCache<string, CacheEntry>({
    length: (e, key) => e.body.length + (key ? key.length : 0),
    max: 52428800,
    // don't call dispose on overwriting
    noDisposeOnSet: true,
    // remove file path -> url mapping when we are no longer caching it
    dispose(cacheKey) {
      for (const [filePath, cacheKeyForFilePath] of cacheKeysForFilePaths.entries()) {
        if (cacheKeyForFilePath === cacheKey) {
          cacheKeysForFilePaths.delete(filePath);
          return;
        }
      }
    },
  });

  // remove file from cache on change
  cfg.fileWatcher.addListener('change', e => {
    const cacheKey = cacheKeysForFilePaths.get(e);
    if (cacheKey) {
      cache.del(cacheKey);
    }
  });

  return async function responseBodyCacheMiddleware(ctx, next) {
    const cacheKey = createCacheKey(ctx);
    const cached = cache.get(cacheKey);
    if (cached) {
      // we watch files, and remove them on change, but there can be edge cases
      // where these events do not come through properly (the file system is a 'live' system)
      // we double check the last modified timestamp first
      if (cached.lastModified === (await getLastModified(cached.filePath))) {
        ctx.body = cached.body;
        ctx.response.set(cached.headers);
        ctx.status = 200;
        logDebug(`Serving from response body cache: ${ctx.url}`);
        return;
      }

      // remove file from cache if it changed in the meantime, and serve regularly
      cache.del(cacheKey);
    }

    await next();

    if (ctx.method !== 'GET' || !ctx.body) {
      return;
    }

    if (ctx.status !== 200) {
      return;
    }

    if (isGeneratedFile(ctx.url) || !ctx.response.is('js')) {
      return;
    }

    try {
      const body = await getBodyAsString(ctx);
      const filePath = getRequestFilePath(ctx, cfg.rootDir);
      if (!filePath) {
        return;
      }

      cacheKeysForFilePaths.set(filePath, ctx.url);
      cache.set(cacheKey, {
        body,
        headers: ctx.response.headers,
        filePath,
        lastModified: await getLastModified(filePath),
      });
      logDebug(`Adding to response body cache: ${ctx.url}`);
    } catch (error) {
      if (error instanceof RequestCancelledError) {
        return;
      }
      throw error;
    }
  };
}
