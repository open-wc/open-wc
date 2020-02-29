import koaStatic from 'koa-static';
import koaEtag from 'koa-etag';
import koaCompress from 'koa-compress';
import chokidar from 'chokidar';
import { createBasePathMiddleware } from './middleware/base-path.js';
import { createHistoryAPIFallbackMiddleware } from './middleware/history-api-fallback.js';
import { createCompatibilityTransformMiddleware } from './middleware/compatibility-transform.js';
import { createWatchServedFilesMiddleware } from './middleware/watch-served-files.js';
import { createPolyfillsLoaderMiddleware } from './middleware/polyfills-loader.js';
import { createMessageChannelMiddleware } from './middleware/message-channel.js';
import { createEtagCacheMiddleware } from './middleware/etag-cache.js';
import { createResponseBodyCacheMiddleware } from './middleware/response-body-cache.js';
import { setupBrowserReload } from './utils/setup-browser-reload.js';
import { compatibilityModes } from './constants.js';
import { createResponseTransformMiddleware } from './middleware/response-transform.js';
import { createResolveModuleImports } from './utils/resolve-module-imports.js';
import { createCompatibilityTransform } from './utils/compatibility-transform.js';
import { logDebug } from './utils/utils.js';

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
export function createMiddlewares(config, fileWatcher =  chokidar.watch([])) {
  const {
    appIndex,
    appIndexDir,
    babelExclude,
    babelModernExclude,
    babelModuleExclude,
    basePath,
    compatibilityMode,
    compress,
    customBabelConfig,
    customMiddlewares,
    responseTransformers,
    fileExtensions,
    nodeResolve,
    polyfillsLoaderConfig,
    readUserBabelConfig,
    rootDir,
    watch,
    logErrorsToBrowser,
    watchDebounce,
  } = config;

  /** @type {import('koa').Middleware[]} */
  const middlewares = [];

  middlewares.push((ctx, next) => {
    logDebug(`Receiving request: ${ctx.url}`);
    return next();
  });

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

  const setupCompatibility =
    customBabelConfig || compatibilityMode !== compatibilityModes.NONE || readUserBabelConfig;
  const setupHistoryFallback = appIndex;
  const setupMessageChanel = watch || (logErrorsToBrowser && (setupCompatibility || nodeResolve));

  const resolveModuleImports = nodeResolve
    ? createResolveModuleImports(
        rootDir,
        fileExtensions,
        typeof nodeResolve === 'boolean' ? undefined : nodeResolve,
      )
    : undefined;
  const transformJs =
    setupCompatibility || nodeResolve
      ? createCompatibilityTransform(
          {
            rootDir,
            readUserBabelConfig,
            nodeResolve,
            compatibilityMode,
            customBabelConfig,
            fileExtensions,
            babelExclude,
            babelModernExclude,
            babelModuleExclude,
          },
          resolveModuleImports,
        )
      : undefined;

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

  middlewares.push(async (ctx, next) => {
    await next();
    logDebug(`Serving request: ${ctx.url} with status: ${ctx.status}`);
  });

  // serves 304 responses if resource hasn't changed
  middlewares.push(createEtagCacheMiddleware());

  // adds etag headers for caching
  middlewares.push(koaEtag());

  if (fileWatcher) {
    // caches (transformed) file contents for faster response times
    middlewares.push(createResponseBodyCacheMiddleware({ fileWatcher, rootDir, fileExtensions }));
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
  if (setupCompatibility || nodeResolve) {
    middlewares.push(
      createCompatibilityTransformMiddleware({
        rootDir,
        fileExtensions,
        transformJs,
      }),
    );
  }

  // injects polyfills and shims for compatibility with older browsers
  if (setupCompatibility || nodeResolve) {
    middlewares.push(
      createPolyfillsLoaderMiddleware({
        compatibilityMode,
        polyfillsLoaderConfig,
        rootDir,
        appIndex,
        transformJs,
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
