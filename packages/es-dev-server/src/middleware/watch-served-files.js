import path from 'path';

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
  // should be a 2xx response
  if (ctx.status < 200 || ctx.status >= 300) {
    return;
  }

  // should be a file request
  if (!ctx.url.includes('.')) {
    return;
  }

  const filePath = path.join(cfg.rootDir, ctx.url.split('?')[0].split('#')[0]);
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
