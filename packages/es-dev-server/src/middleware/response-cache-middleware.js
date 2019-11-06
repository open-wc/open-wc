/* eslint-disable no-restricted-syntax */
import LRUCache from 'lru-cache';
import fs from 'fs';
import { promisify } from 'util';
import { baseFileExtensions } from '../constants.js';
import { getBodyAsString, getRequestFilePath, isGeneratedFile } from '../utils/utils.js';

const stat = promisify(fs.stat);

/**
 * @typedef {object} ResponseCacheMiddlewareConfig
 * @property {import('chokidar').FSWatcher} fileWatcher
 * @property {string} rootDir
 * @property {string[]} extraFileExtensions
 */

/**
 * @typedef {object} CacheEntry
 * @property {string} body
 * @property {object} headers
 * @property {string} filePath
 * @property {number} lastModified
 */

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
 * @param {ResponseCacheMiddlewareConfig} cfg
 */
export function createResponseCacheMiddleware(cfg) {
  const fileExtensions = [...baseFileExtensions, ...cfg.extraFileExtensions];

  /** @type {Map<String, String>} */
  const urlForFilePaths = new Map();

  /** @type {import('lru-cache')<string, CacheEntry>} */
  const cache = new LRUCache({
    length: (e, key) => e.body.length + key.length,
    max: 52428800,
    // don't call dispose on overwriting
    noDisposeOnSet: true,
    // remove file path -> url mapping when we are no longer caching it
    dispose(url) {
      for (const [filePath, urlForFilePath] of urlForFilePaths.entries()) {
        if (urlForFilePath === url) {
          urlForFilePaths.delete(filePath);
          return;
        }
      }
    },
  });

  // remove file from cache on change
  cfg.fileWatcher.addListener('change', e => {
    const filePath = urlForFilePaths.get(e);
    if (filePath) {
      cache.del(filePath);
    }
  });

  /** @type {import('koa').Middleware} */
  async function responseCacheMiddleware(ctx, next) {
    const cached = cache.get(ctx.url);
    if (cached) {
      // we watch files, and remove them on change, but there can be edge cases
      // where these events do not come through properly (the file system is a 'live' system)
      // we double check the last modified timestamp first
      if (cached.lastModified === (await getLastModified(cached.filePath))) {
        ctx.body = cached.body;
        ctx.response.set(cached.headers);
        ctx.status = 200;
        return;
      }

      // remove file from cache if it changed in the meantime, and serve regularly
      cache.del(ctx.url);
    }

    await next();

    if (ctx.method !== 'GET' || !ctx.body) {
      return;
    }

    if (ctx.status !== 200) {
      return;
    }

    const strippedUrl = ctx.url.split('?')[0].split('#')[0];
    if (isGeneratedFile(ctx.url) || !fileExtensions.some(ext => strippedUrl.endsWith(ext))) {
      return;
    }

    const body = await getBodyAsString(ctx);
    const filePath = getRequestFilePath(ctx, cfg.rootDir);
    urlForFilePaths.set(filePath, ctx.url);
    cache.set(ctx.url, {
      body,
      headers: ctx.response.headers,
      filePath,
      lastModified: await getLastModified(filePath),
    });
  }

  return responseCacheMiddleware;
}
