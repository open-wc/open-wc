/* eslint-disable no-restricted-syntax */
import { FSWatcher } from 'chokidar';
import fs from 'fs';
import { Context } from 'koa';
import LRUCache from 'lru-cache';
import { promisify } from 'util';
import { PluginServeMiddlewareConfig } from './middleware/plugin-transform';
import {
  getBodyAsString,
  getRequestFilePath,
  isGeneratedFile,
  logDebug,
  RequestCancelledError,
} from './utils/utils';

const stat = promisify(fs.stat);

interface ResponseBodyCache {
  rootDir: string;
  fileExtensions: string[];
}

interface CacheEntry {
  body: string;
  headers: Record<string, string>;
  filePath: string;
  lastModified: number;
}

interface CacheConfig {
  cache: LRUCache<string, CacheEntry>;
  cacheKey: string;
  cacheKeysForFilePaths: Map<String, String>;
  context: Context;
  cfg: PluginServeMiddlewareConfig;
}

/**
 * Cache by user agent + file path, so that there can be unique transforms
 * per browser.
 */
function createCacheKey(context: Context) {
  return `${context.get('user-agent')}${context.url}`;
}

async function getLastModified(path: string): Promise<number> {
  try {
    return (await stat(path)).mtimeMs;
  } catch (error) {
    return -1;
  }
}

export function createResponseBodyCache(cfg: ResponseBodyCache, fileWatcher: FSWatcher) {
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
  fileWatcher.addListener('change', e => {
    const cacheKey = cacheKeysForFilePaths.get(e);
    if (cacheKey) {
      cache.del(cacheKey);
    }
  });

  return { cache, cacheKeysForFilePaths };
}

export async function tryServeFromCache(cache: LRUCache<string, CacheEntry>, context: Context) {
  /** @type {string} */
  let servingFromCache = false;
  const cacheKey = createCacheKey(context);
  const cached = cache.get(cacheKey);
  if (cached) {
    // we watch files, and remove them on change, but there can be edge cases
    // where these events do not come through properly (the file system is a 'live' system)
    // we double check the last modified timestamp first
    if (cached.lastModified === (await getLastModified(cached.filePath))) {
      context.body = cached.body;
      context.response.set(cached.headers);
      context.status = 200;
      servingFromCache = true;
      logDebug(`Serving from response body cache: ${context.url}`);
    } else {
      // remove file from cache if it changed in the meantime, and serve regularly
      cache.del(cacheKey);
    }
  }

  return { cacheKey, context, cached: servingFromCache, cachedBody: cached?.body };
}

export async function addToCache(config: CacheConfig) {
  const { cache, cacheKey, cacheKeysForFilePaths, context, cfg } = config;

  if (context.method !== 'GET' || !context.body) {
    return;
  }

  if (context.status !== 200) {
    return;
  }

  if (isGeneratedFile(context.url) || !context.response.is('js')) {
    return;
  }

  try {
    const body = await getBodyAsString(context);
    const filePath = getRequestFilePath(context, cfg.rootDir);
    if (!filePath) {
      return;
    }

    cacheKeysForFilePaths.set(filePath, context.url);
    cache.set(cacheKey, {
      body,
      headers: context.response.headers,
      filePath,
      lastModified: await getLastModified(filePath),
    });
    logDebug(`Adding to response body cache: ${context.url}`);
  } catch (error) {
    if (error instanceof RequestCancelledError) {
      return;
    }
    throw error;
  }
}
