/* eslint-disable no-restricted-syntax */
import LRUCache from 'lru-cache';
import fs from 'fs';
import { promisify } from 'util';
import {
  getBodyAsString,
  getRequestFilePath,
  isGeneratedFile,
  RequestCancelledError,
  logDebug,
} from '../utils/utils.js';

const stat = promisify(fs.stat);

/**
 * @typedef {object} ResponseBodyCacheMiddleware
 * @property {import('chokidar').FSWatcher} fileWatcher
 * @property {string} rootDir
 * @property {string[]} fileExtensions
 */

/**
 * @typedef {object} CacheEntry
 * @property {string} body
 * @property {object} headers
 * @property {string} filePath
 * @property {number} lastModified
 */

/**
 * Cache by user agent + file path, so that there can be unique transforms
 * per browser.
 */
function createCacheKey(ctx) {
  return `${ctx.get('user-agent')}${ctx.url}`;
}

/**
 * @param {string} path
 * @returns {Promise<number>}
 */
async function getLastModified(path) {
  try {
    return (await stat(path)).mtimeMs;
  } catch (error) {
    return -1;
  }
}

/**
 * Returns 304 response for cacheable requests if etag matches
 * @param {ResponseBodyCacheMiddleware} cfg
 */
export function createResponseBodyCacheMiddleware(cfg) {
  /** @type {Map<String, String>} */
  const cacheKeysForFilePaths = new Map();

  /** @type {import('lru-cache')<string, CacheEntry>} */
  const cache = new LRUCache({
    length: (e, key) => e.body.length + key.length,
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

  /** @type {import('koa').Middleware} */
  async function responseBodyCacheMiddleware(ctx, next) {
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

    const strippedUrl = ctx.url.split('?')[0].split('#')[0];
    if (isGeneratedFile(ctx.url) || !cfg.fileExtensions.some(ext => strippedUrl.endsWith(ext))) {
      return;
    }

    try {
      const body = await getBodyAsString(ctx);
      const filePath = getRequestFilePath(ctx, cfg.rootDir);
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
  }

  return responseBodyCacheMiddleware;
}
