import minimatch from 'minimatch';
import { getBodyAsString } from '../utils.js';
import { compatibilityModes, baseFileExtensions } from '../constants.js';
import { sendMessageToActiveBrowsers } from './message-channel.js';
import createBabelCompiler from '../babel-compiler.js';

/**
 * @typedef {object} BabelMiddlewareConfig
 * @property {string} rootDir
 * @property {string[]} moduleDirectories
 * @property {boolean} nodeResolve
 * @property {boolean} readUserBabelConfig
 * @property {string} compatibilityMode
 * @property {object} [customBabelConfig]
 * @property {string[]} extraFileExtensions
 * @property {string[]} babelModernExclude patterns to exclude from modern babel compilation
 * @property {string[]} babelExclude patterns to exclude from all babel compilation
 */

/**
 * Returns whether we should compile this file with babel.
 * @param {string} file
 * @param {boolean} legacy
 * @param {BabelMiddlewareConfig} cfg
 */
function shouldCompile(file, legacy, cfg) {
  if (cfg.babelExclude.some(pattern => minimatch(file, pattern))) {
    return false;
  }

  return legacy || !cfg.babelModernExclude.some(pattern => minimatch(file, pattern));
}

/**
 * Sets up a middleware which runs all served js code through babel. Different babel configs
 * are loaded based on the server's configuration.
 *
 * @param {BabelMiddlewareConfig} cfg
 */
export function createBabelMiddleware(cfg) {
  const fileExtensions = [...baseFileExtensions, ...cfg.extraFileExtensions];

  // create the default compiler, enable the modern config if all or modern compatibility mode is on
  const modern = [compatibilityModes.MODERN, compatibilityModes.ALL].includes(
    cfg.compatibilityMode,
  );
  const babelCompiler = createBabelCompiler({ ...cfg, modern, legacy: false });

  // create the legacy compiler if all compatibility mode is on
  const legacyBabelCompiler =
    cfg.compatibilityMode === compatibilityModes.ALL
      ? createBabelCompiler({ ...cfg, modern: false, legacy: true })
      : null;

  /** @type {import('koa').Middleware} */
  async function babelMiddleware(ctx, next) {
    const baseURL = ctx.url.split('?')[0].split('#')[0];
    if (!fileExtensions.some(ext => baseURL.endsWith(ext))) {
      return next();
    }

    await next();

    // should be a 2xx response
    if (ctx.status < 200 || ctx.status >= 300) {
      return undefined;
    }

    const filePath = ctx.body && ctx.body.path;
    const lastModified = ctx.response.headers['last-modified'];

    if (!filePath || !lastModified) {
      return undefined;
    }

    // we use the legacy compiler if the request ends with a legacy paramter
    const legacy = ctx.url.endsWith('?legacy=true');
    if (legacy && !legacyBabelCompiler) {
      throw new Error(`Set compatibility mode to 'all' to compile for legacy browsers.`);
    }

    if (!shouldCompile(filePath, legacy, cfg)) {
      return undefined;
    }

    const compiler = legacy ? legacyBabelCompiler : babelCompiler;

    // Ensure we respond with js content type
    ctx.response.set('content-type', 'application/javascript; charset=utf-8');

    // if we have a cached compilation for a file which wasn't modified in the meantime, return that
    const cachedBody = compiler.getFromCache(filePath, lastModified);
    if (cachedBody) {
      ctx.body = cachedBody;
      return undefined;
    }

    try {
      const bodyString = await getBodyAsString(ctx.body);
      const compiled = await compiler.compile(filePath, bodyString, lastModified);
      ctx.body = compiled;
      return undefined;
    } catch (error) {
      // send compile error to browser for logging
      ctx.body = `Error compiling: ${error.message}`;
      ctx.status = 500;
      sendMessageToActiveBrowsers('error-message', JSON.stringify(error.message));
      /* eslint-disable-next-line no-console */
      console.error(error);
    }
    return undefined;
  }

  return babelMiddleware;
}
