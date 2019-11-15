import koaStatic from 'koa-static';
import koaEtag from 'koa-etag';
import koaCompress from 'koa-compress';
import { createBasePathMiddleware } from './middleware/base-path.js';
import { createHistoryAPIFallbackMiddleware } from './middleware/history-api-fallback.js';
import { createCompatibilityTransformMiddleware } from './middleware/compatibility-transform.js';
import { createWatchServedFilesMiddleware } from './middleware/watch-served-files.js';
import { createTransformIndexHTMLMiddleware } from './middleware/transform-index-html.js';
import { createMessageChannelMiddleware } from './middleware/message-channel.js';
import { createEtagCacheMiddleware } from './middleware/etag-cache.js';
import { createResponseBodyCacheMiddleware } from './middleware/response-body-cache.js';
import { setupBrowserReload } from './utils/setup-browser-reload.js';
import { compatibilityModes } from './constants.js';
import { createResponseTransformMiddleware } from './middleware/response-transform.js';

const defaultCompressOptions = {
  filter(contentType) {
    // event stream doesn't like compression
    return contentType !== 'text/event-stream';
  },
};

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
    appIndex,
    appIndexDir,
    babelExclude,
    basePath,
    compatibilityMode,
    polyfillsMode,
    compress,
    customBabelConfig,
    customMiddlewares,
    responseTransformers,
    extraFileExtensions,
    moduleDirectories,
    nodeResolve,
    preserveSymlinks,
    readUserBabelConfig,
    rootDir,
    watch,
    watchDebounce,
  } = config;

  /** @type {import('koa').Middleware[]} */
  const middlewares = [];

  if (compress) {
    const options = typeof compress === 'object' ? compress : defaultCompressOptions;
    middlewares.push(koaCompress(options));
  }

  if (!Object.values(compatibilityModes).includes(compatibilityMode)) {
    throw new Error(
      `Unknown compatibility mode: ${compatibilityMode}. Must be one of: ${Object.values(
        compatibilityModes,
      )}`,
    );
  }

  const setupBabel =
    customBabelConfig || compatibilityMode !== compatibilityModes.NONE || readUserBabelConfig;
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
    middlewares.push(
      createResponseBodyCacheMiddleware({ fileWatcher, rootDir, extraFileExtensions }),
    );
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
      createCompatibilityTransformMiddleware({
        rootDir,
        moduleDirectories,
        readUserBabelConfig,
        compatibilityMode,
        extraFileExtensions,
        customBabelConfig,
        babelExclude,
        nodeResolve,
        preserveSymlinks,
      }),
    );
  }

  // injects polyfills and shims for compatibility with older browsers
  if (setupTransformIndexHTML) {
    middlewares.push(
      createTransformIndexHTMLMiddleware({
        compatibilityMode,
        polyfillsMode,
        appIndex,
        appIndexDir,
      }),
    );
  }

  // serves index.html for non-file requests for SPA routing
  if (setupHistoryFallback) {
    middlewares.push(createHistoryAPIFallbackMiddleware({ appIndex, appIndexDir }));
  }

  if (watch) {
    setupBrowserReload({ fileWatcher, watchDebounce });
  }

  if (responseTransformers) {
    middlewares.push(createResponseTransformMiddleware({ responseTransformers }));
  }

  // serve sstatic files
  middlewares.push(
    koaStatic(rootDir, {
      hidden: true,
      setHeaders(res) {
        res.setHeader('cache-control', 'no-cache');
      },
    }),
  );

  return middlewares;
}
