import koaStatic from 'koa-static';
import koaEtag from 'koa-etag';
import { createBasePathMiddleware } from './middleware/base-path.js';
import { createHistoryAPIFallbackMiddleware } from './middleware/history-api-fallback.js';
import { createCompileMiddleware } from './middleware/compile-middleware.js';
import { createWatchServedFilesMiddleware } from './middleware/watch-served-files.js';
import { createTransformIndexHTMLMiddleware } from './middleware/transform-index-html.js';
import { createMessageChannelMiddleware } from './middleware/message-channel.js';
import { createEtagCacheMiddleware } from './middleware/etag-cache-middleware.js';
import { createResponseCacheMiddleware } from './middleware/response-cache-middleware.js';
import { setupBrowserReload } from './utils/setup-browser-reload.js';
import { compatibilityModes } from './constants.js';

/**
 * Creates middlewares based on the given configuration. The middlewares can be
 * used by a koa server using `app.use()`:
 *
 * @param {import('./config').InternalConfig} config the server configuration
 * @param {import('chokidar').FSWatcher} fileWatcher
 * @returns {import('koa').Middleware[]}
 */
export function createMiddlewares(config, fileWatcher) {
  const {
    rootDir,
    appIndex,
    appIndexDir,
    basePath,
    moduleDirectories,
    nodeResolve,
    preserveSymlinks,
    readUserBabelConfig,
    customBabelConfig,
    watch,
    extraFileExtensions,
    compatibilityMode,
    babelExclude,
    babelModernExclude,
    watchDebounce,
    customMiddlewares,
  } = config;

  /** @type {import('koa').Middleware[]} */
  const middlewares = [];

  if (!Object.values(compatibilityModes).includes(compatibilityMode)) {
    throw new Error(
      `Unknown compatibility mode: ${compatibilityMode}. Must be one of: ${Object.values(
        compatibilityModes,
      )}`,
    );
  }

  const setupBabel =
    customBabelConfig ||
    [compatibilityModes.ALL, compatibilityModes.MODERN].includes(compatibilityMode) ||
    readUserBabelConfig;
  const setupCompatibility = compatibilityMode && compatibilityMode !== compatibilityModes.NONE;
  const setupTransformIndexHTML = nodeResolve || setupBabel || setupCompatibility;
  const setupHistoryFallback = appIndex;
  const setupMessageChanel = nodeResolve || watch || setupBabel;

  // strips a base path from requests
  if (config.basePath) {
    middlewares.push(createBasePathMiddleware({ basePath }));
  }

  // adds custom user's middlewares
  if (customMiddlewares && customMiddlewares.length > 0) {
    customMiddlewares.forEach(customMiddleware => {
      middlewares.push(customMiddleware);
    });
  }

  // serves 304 responses if resource hasn't changed
  middlewares.push(createEtagCacheMiddleware());

  // adds etag headers for caching
  middlewares.push(koaEtag());

  if (fileWatcher) {
    // caches (transformed) file contents for faster response times
    middlewares.push(createResponseCacheMiddleware({ fileWatcher, rootDir, extraFileExtensions }));
  }

  // communicates with browser for reload or logging
  if (setupMessageChanel) {
    middlewares.push(createMessageChannelMiddleware({ rootDir, appIndex }));
  }

  // watches served files
  middlewares.push(
    createWatchServedFilesMiddleware({
      rootDir,
      fileWatcher,
    }),
  );

  // compile code using babel and/or resolve module imports
  if (setupBabel || nodeResolve) {
    middlewares.push(
      createCompileMiddleware({
        rootDir,
        moduleDirectories,
        readUserBabelConfig,
        compatibilityMode,
        extraFileExtensions,
        customBabelConfig,
        babelExclude,
        babelModernExclude,
        nodeResolve,
        preserveSymlinks,
      }),
    );
  }

  // injects polyfills and shims for compatibility with older browsers
  if (setupTransformIndexHTML) {
    middlewares.push(
      createTransformIndexHTMLMiddleware({ compatibilityMode, appIndex, appIndexDir }),
    );
  }

  // serves index.html for non-file requests for SPA routing
  if (setupHistoryFallback) {
    middlewares.push(createHistoryAPIFallbackMiddleware({ appIndex, appIndexDir }));
  }

  if (watch) {
    setupBrowserReload({ fileWatcher, watchDebounce });
  }

  // serve sstatic files
  middlewares.push(
    koaStatic(rootDir, {
      setHeaders(res) {
        res.setHeader('cache-control', 'no-cache');
      },
    }),
  );

  return middlewares;
}
