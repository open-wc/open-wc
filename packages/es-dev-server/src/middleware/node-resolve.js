import { getBodyAsString, getRequestFilePath } from '../utils/utils.js';
import { sendMessageToActiveBrowsers } from './message-channel.js';
import { baseFileExtensions } from '../constants.js';
import { resolveModuleImports, ResolveSyntaxError } from '../utils/resolve-module-imports.js';
import { createCachingCompiler } from '../utils/caching-compiler.js';

/**
 * @typedef {object} NodeResolveMiddlewareConfig
 * @property {string} rootDir
 * @property {string[]} extraFileExtensions
 * @property {string[]} moduleDirectories
 * @property {boolean} preserveSymlinks
 * @property {boolean} cacheCompilation
 * @property {boolean} logCompileErrors
 */

/**
 * @param {NodeResolveMiddlewareConfig} cfg
 */
export function createNodeResolveMiddleware(cfg) {
  const fileExtensions = [...baseFileExtensions, ...cfg.extraFileExtensions];
  const compile = (file, src) =>
    resolveModuleImports(cfg.rootDir, file, src, {
      fileExtensions,
      moduleDirectories: cfg.moduleDirectories,
      preserveSymlinks: cfg.preserveSymlinks,
    });

  /** Set up a caching compiler if we needed, otherwise we compile without caching. The latter
   * is the case when there are other middlewares which already do caching. */
  const cachingCompiler = cfg.cacheCompilation ? createCachingCompiler(compile) : null;

  /** @type {import('koa').Middleware} */
  async function nodeResolveMiddleware(ctx, next) {
    const baseURL = ctx.url.split('?')[0].split('#')[0];
    if (baseURL.startsWith('/polyfills') || !fileExtensions.some(ext => baseURL.endsWith(ext))) {
      return next();
    }

    await next();

    // should be a 2xx response
    if (ctx.status < 200 || ctx.status >= 300) {
      return undefined;
    }

    const filePath = getRequestFilePath(ctx, cfg.rootDir);
    const lastModified = ctx.response.headers['last-modified'];
    if (!filePath || !lastModified) {
      return undefined;
    }

    // Ensure we respond with js content type
    ctx.response.set('content-type', 'text/javascript');

    // if we have a cached compilation for a file which wasn't modified in the meantime, return that
    if (cachingCompiler) {
      const cachedBody = cachingCompiler.getFromCache(filePath, lastModified);
      if (cachedBody) {
        ctx.body = cachedBody;
        return undefined;
      }
    }

    try {
      const source = await getBodyAsString(ctx);
      // compile using the caching compiler if defined, otherwise compile without cache
      const compiled = await (cachingCompiler
        ? cachingCompiler.compile(filePath, source, lastModified)
        : compile(filePath, source));
      ctx.body = compiled;
      return undefined;
    } catch (error) {
      const errorMessage = `Error resolving imports in "${ctx.url}": ${error.message}`;

      // for regular syntax errors we don't send a 500 so that we don't overwrite the
      // browser's syntax error logging
      if (!(error instanceof ResolveSyntaxError)) {
        ctx.body = errorMessage;
        ctx.status = 500;
      }

      sendMessageToActiveBrowsers('error-message', JSON.stringify(errorMessage));

      if (cfg.logCompileErrors) {
        /* eslint-disable-next-line no-console */
        console.error(errorMessage);
      }
    }
    return undefined;
  }

  return nodeResolveMiddleware;
}
