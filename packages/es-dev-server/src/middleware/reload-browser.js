import path from 'path';
import debounce from 'debounce';
import minimatch from 'minimatch';
import { sendMessageToActiveBrowsers } from './message-channel.js';

/**
 * @typedef {object} ReloadBrowserMiddlewareConfig
 * @property {string} rootDir
 * @property {import('chokidar').FSWatcher} fileWatcher
 * @property {string[]} watchExcludes
 * @property {number} watchDebounce
 */

/**
 * @param {import('koa').Context} ctx
 * @param {ReloadBrowserMiddlewareConfig} cfg
 * @param {string[]} excludes
 */
async function watchServedFile(ctx, cfg, excludes) {
  // should be a 2xx response
  if (ctx.status < 200 || ctx.status >= 300) {
    return;
  }

  // should be a file request
  if (!ctx.url.includes('.')) {
    return;
  }

  const filePath = path.join(cfg.rootDir, ctx.url.split('?')[0].split('#')[0]);
  // the path is excluded (for example node_modules)
  if (excludes.some(pattern => minimatch(filePath, pattern))) {
    return;
  }

  cfg.fileWatcher.add(filePath);
}

function onFileChanged() {
  sendMessageToActiveBrowsers('file-changed');
}

/**
 * Sets up a middleware which tracks served files and sends a reload message to any
 * active browsers when any of the files change.
 *
 * @param {ReloadBrowserMiddlewareConfig} cfg
 */
export function createReloadBrowserMiddleware(cfg) {
  const excludes = cfg.watchExcludes.map(e => path.join(cfg.rootDir, e));
  cfg.fileWatcher.addListener('change', debounce(onFileChanged, cfg.watchDebounce));

  /** @type {import('koa').Middleware} */
  async function reloadBrowserMiddleware(ctx, next) {
    await next();

    watchServedFile(ctx, cfg, excludes);
  }

  return reloadBrowserMiddleware;
}
