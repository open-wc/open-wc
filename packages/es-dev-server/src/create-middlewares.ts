import chokidar from 'chokidar';
import { Middleware } from 'koa';
import koaCompress from 'koa-compress';
import koaEtag from 'koa-etag';
import koaStatic from 'koa-static';
import koaCors from '@koa/cors';
import Koa from 'koa';
import { Server } from 'net';
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
import { logDebug } from './utils/utils';
import { MessageChannel } from './utils/MessageChannel';
import { browserReloadPlugin } from './plugins/browserReloadPlugin';

const defaultCompressOptions = {
  filter(contentType: string) {
    // event stream doesn't like compression
    return contentType !== 'text/event-stream';
  },
};

function hasHook(plugins: Plugin[], hook: string) {
  return plugins.some(plugin => hook in plugin);
}

/**
 * Creates middlewares based on the given configuration. The middlewares can be
 * used by a koa server using `app.use()`:
 */
export function createMiddlewares(config: ParsedConfig, fileWatcher = chokidar.watch([])) {
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
    customBabelInclude,
    customBabelExclude,
    cors,
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
  const setupMessageChannel = watch || (logErrorsToBrowser && (setupCompatibility || nodeResolve));
  const messageChannel = setupMessageChannel ? new MessageChannel() : undefined;

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
        customBabelInclude,
        customBabelExclude,
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

  if (watch) {
    plugins.push(browserReloadPlugin({ watchDebounce }));
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
  if (setupMessageChannel && messageChannel) {
    middlewares.push(createMessageChannelMiddleware({ messageChannel }));
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

  middlewares.push(
    createPluginTransformMiddlware({
      plugins,
      fileWatcher,
      rootDir,
      fileExtensions,
      messageChannel,
      logErrorsToBrowser,
    }),
  );

  // DEPRECATED: Response transformers (now split up in serve and transform in plugins)
  if (responseTransformers) {
    middlewares.push(createResponseTransformMiddleware({ responseTransformers }));
  }

  middlewares.push(createPluginMimeTypeMiddleware({ plugins }));

  if (cors) {
    middlewares.push(koaCors())
  }

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

  return {
    middlewares,

    // callback called by start-server
    async onServerStarted(app: Koa, server: Server) {
      // call server start plugin hooks in parallel
      const startHooks = plugins
        .filter(pl => !!pl.serverStart)
        .map(pl => pl.serverStart?.({ config, app, server, fileWatcher, messageChannel }));
      await Promise.all(startHooks);
    },
  };
}
