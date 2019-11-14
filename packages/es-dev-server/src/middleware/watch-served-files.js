import { isGeneratedFile, getRequestFilePath } from '../utils/utils.js';

/**
 * @typedef {object} WatchServedFilesMiddlewareConfig
 * @property {string} rootDir
 * @property {import('chokidar').FSWatcher} fileWatcher
 */

/**
 * @param {import('koa').Context} ctx
 * @param {WatchServedFilesMiddlewareConfig} cfg
 */
async function watchServedFile(ctx, cfg) {
  const filePath = getRequestFilePath(ctx, cfg.rootDir);

  if (!filePath || isGeneratedFile(ctx.url)) {
    return;
  }

  cfg.fileWatcher.add(filePath);
}

/**
 * Sets up a middleware which tracks served files and sends a reload message to any
 * active browsers when any of the files change.
 *
 * @param {WatchServedFilesMiddlewareConfig} cfg
 */
export function createWatchServedFilesMiddleware(cfg) {
  /** @type {import('koa').Middleware} */
  async function watchServedFilesMiddleware(ctx, next) {
    await next();

    watchServedFile(ctx, cfg);
  }

  return watchServedFilesMiddleware;
}
