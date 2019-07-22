import koaStatic from 'koa-static';
import koaEtag from 'koa-etag';
import { createHistoryAPIFallbackMiddleware } from './middleware/history-api-fallback.js';
import { createBabelMiddleware } from './middleware/babel.js';
import { createReloadBrowserMiddleware } from './middleware/reload-browser.js';
import { createTransformIndexHTMLMiddleware } from './middleware/transform-index-html.js';
import { createMessageChannelMiddleware } from './middleware/message-channel.js';
import { createCacheMiddleware } from './middleware/cache.js';
import { compatibilityModes } from './constants.js';

/**
 * Creates middlewares based on the given configuration. The middlewares can be
 * used by a koa server using `app.use()`:
 *
 * @param {import('./config').InternalConfig} config the server configuration
 * @param {import('chokidar').FSWatcher} [fileWatcher] an optional chokidar file watcher instance
 *   this must be passed if watch is true
 * @returns {import('koa').Middleware[]}
 */
export function createMiddlewares(config, fileWatcher) {
  const {
    rootDir,
    appIndex,
    appIndexDir,
    moduleDirectories,
    nodeResolve,
    readUserBabelConfig,
    customBabelConfig,
    watch,
    extraFileExtensions,
    compatibilityMode,
    babelExclude,
    babelModernExclude,
    watchExcludes,
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

  if (watch && !fileWatcher) {
    throw new Error('Must provide a fileWatcher if watch is true.');
  }

  const setupBabel =
    customBabelConfig ||
    nodeResolve ||
    [compatibilityModes.ALL, compatibilityModes.MODERN].includes(compatibilityMode) ||
    readUserBabelConfig;
  const setupCompatibility = compatibilityMode && compatibilityMode !== compatibilityModes.NONE;
  const setupTransformIndexHTML = setupBabel || setupCompatibility;
  const setupHistoryFallback = appIndex;
  const setupMessageChanel = watch || setupBabel;

  // add custom user's middlewares
  if (customMiddlewares && customMiddlewares.length > 0) {
    customMiddlewares.forEach(customMiddleware => {
      middlewares.push(customMiddleware);
    });
  }

  // serves 304 responses if resource hasn't changed
  middlewares.push(createCacheMiddleware());
  // adds etag headers for caching
  middlewares.push(koaEtag());

  // communicate with browser for reload or logging
  if (setupMessageChanel) {
    middlewares.push(createMessageChannelMiddleware({ rootDir, appIndex }));
  }

  // watch files and reload browser
  if (watch) {
    middlewares.push(
      createReloadBrowserMiddleware({
        rootDir,
        fileWatcher,
        watchExcludes,
        watchDebounce,
      }),
    );
  }

  // run code through babel for compatibility with older browsers
  if (setupBabel) {
    middlewares.push(
      createBabelMiddleware({
        rootDir,
        moduleDirectories,
        nodeResolve,
        readUserBabelConfig,
        compatibilityMode,
        extraFileExtensions,
        customBabelConfig,
        babelExclude,
        babelModernExclude,
      }),
    );
  }

  // inject polyfills and shims for compatibility with older browsers
  if (setupTransformIndexHTML) {
    middlewares.push(
      createTransformIndexHTMLMiddleware({ compatibilityMode, appIndex, appIndexDir }),
    );
  }

  // serve index.html for non-file requests for SPA routing
  if (setupHistoryFallback) {
    middlewares.push(createHistoryAPIFallbackMiddleware({ appIndex, appIndexDir }));
  }

  // serve ststic files
  middlewares.push(
    koaStatic(rootDir, {
      setHeaders(res) {
        res.setHeader('cache-control', 'no-cache');
      },
    }),
  );

  return middlewares;
}
