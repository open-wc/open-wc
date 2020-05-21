import chokidar from 'chokidar';
import { Middleware } from 'koa';
import koaCompress from 'koa-compress';
import koaEtag from 'koa-etag';
import koaStatic from 'koa-static';
import LRUCache from 'lru-cache';
import { ParsedConfig } from './config';
import { compatibilityModes } from './constants';
import { createBasePathMiddleware } from './middleware/base-path';
import { createEtagCacheMiddleware } from './middleware/etag-cache';
import { createHistoryAPIFallbackMiddleware } from './middleware/history-api-fallback';
import { createMessageChannelMiddleware } from './middleware/message-channel';
import { createPluginMimeTypeMiddleware } from './middleware/plugin-mime-type';
import { createPluginServeMiddlware } from './middleware/plugin-serve';
import { createPluginTransformMiddlware } from './middleware/plugin-transform';
import { createResponseTransformMiddleware } from './middleware/response-transform';
import { createWatchServedFilesMiddleware } from './middleware/watch-served-files';
import { Plugin } from './Plugin';
import { babelTransformPlugin } from './plugins/babelTransformPlugin';
import { fileExtensionsPlugin } from './plugins/fileExtensionsPlugin';
import { nodeResolvePlugin } from './plugins/nodeResolvePlugin';
import { polyfillsLoaderPlugin } from './plugins/polyfillsLoaderPlugin';
import { resolveModuleImportsPlugin } from './plugins/resolveModuleImportsPlugin';
import { createResponseBodyCache } from './response-body-cache';
import { setupBrowserReload } from './utils/setup-browser-reload';
import { logDebug } from './utils/utils';

const defaultCompressOptions = {
  filter(contentType: string) {
    // event stream doesn't like compression
    return contentType !== 'text/event-stream';
  },
};

function hasHook(plugins: Plugin[], hook: string) {
  return plugins.some(plugin => hook in plugin);
}

interface CacheEntry {
  body: string;
  headers: Record<string, string>;
  filePath: string;
  lastModified: number;
}

/**
 * Creates middlewares based on the given configuration. The middlewares can be
 * used by a koa server using `app.use()`:
 */
export function createMiddlewares(
  config: ParsedConfig,
  fileWatcher = chokidar.watch([]),
): Middleware[] {
  const {
    appIndex,
    appIndexDir,
    basePath,
    compatibilityMode,
    compress,
    customBabelConfig,
    customMiddlewares,
    responseTransformers,
    fileExtensions,
    nodeResolve,
    polyfillsLoader,
    polyfillsLoaderConfig,
    readUserBabelConfig,
    plugins,
    rootDir,
    watch,
    logErrorsToBrowser,
    watchDebounce,
    babelExclude,
    babelModernExclude,
    babelModuleExclude,
  } = config;

  const middlewares: Middleware[] = [];

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

  const setupCompatibility = compatibilityMode !== compatibilityModes.NONE;
  const setupBabel = customBabelConfig || readUserBabelConfig;
  const setupHistoryFallback = appIndex;
  const setupMessageChanel = watch || (logErrorsToBrowser && (setupCompatibility || nodeResolve));

  if (fileExtensions.length > 0) {
    plugins.unshift(fileExtensionsPlugin({ fileExtensions }));
  }

  if (nodeResolve || hasHook(plugins, 'resolveImport')) {
    if (nodeResolve) {
      plugins.push(nodeResolvePlugin({ rootDir, fileExtensions, nodeResolve }));
    }
    plugins.push(resolveModuleImportsPlugin({ rootDir, plugins }));
  }

  if (setupCompatibility || setupBabel) {
    plugins.push(
      babelTransformPlugin({
        rootDir,
        readUserBabelConfig,
        nodeResolve,
        compatibilityMode,
        customBabelConfig,
        fileExtensions,
        babelExclude,
        babelModernExclude,
        babelModuleExclude,
      }),
    );
  }

  if (polyfillsLoader && setupCompatibility) {
    plugins.push(
      polyfillsLoaderPlugin({
        rootDir,
        compatibilityMode,
        polyfillsLoaderConfig,
      }),
    );
  }

  let cache: LRUCache<string, CacheEntry> | undefined;
  let cacheKeysForFilePaths: Map<String, String> | undefined;
  if (fileWatcher) {
    ({ cache, cacheKeysForFilePaths } = createResponseBodyCache(config, fileWatcher));
  }

  // strips a base path from requests
  if (basePath) {
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

  // serves index.html for non-file requests for SPA routing
  if (setupHistoryFallback && typeof appIndex === 'string' && typeof appIndexDir === 'string') {
    middlewares.push(createHistoryAPIFallbackMiddleware({ appIndex, appIndexDir }));
  }

  if (watch) {
    setupBrowserReload({ fileWatcher, watchDebounce });
  }

  middlewares.push(
    createPluginTransformMiddlware({
      plugins,
      fileWatcher,
      rootDir,
      fileExtensions,
      cache,
      cacheKeysForFilePaths,
    }),
  );

  // DEPRECATED: Response transformers (now split up in serve and transform in plugins)
  if (responseTransformers) {
    middlewares.push(createResponseTransformMiddleware({ responseTransformers }));
  }

  middlewares.push(createPluginMimeTypeMiddleware({ plugins }));
  middlewares.push(createPluginServeMiddlware({ plugins }));

  // serve static files
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
