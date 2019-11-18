import stripAnsi from 'strip-ansi';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import { getBodyAsString, getRequestFilePath, isPolyfill } from '../utils/utils.js';
import { sendMessageToActiveBrowsers } from '../utils/message-channel.js';
import { ResolveSyntaxError } from '../utils/resolve-module-imports.js';
import { createCompatibilityTransform } from '../utils/compatibility-transform.js';
import { getUserAgentCompat } from '../utils/user-agent-compat.js';

/**
 * @typedef {object} CompatibilityTransformMiddleware
 * @property {string} rootDir
 * @property {string[]} moduleDirectories
 * @property {boolean} readUserBabelConfig
 * @property {boolean} nodeResolve
 * @property {string} compatibilityMode
 * @property {object} [customBabelConfig]
 * @property {string[]} extraFileExtensions
 * @property {string[]} babelExclude
 * @property {string[]} babelModernExclude
 * @property {boolean} preserveSymlinks
 */

/**
 * @param {string} errorMessage
 */
function logError(errorMessage) {
  // strip babel ansi color codes because they're not colored correctly for the browser terminal
  sendMessageToActiveBrowsers('error-message', JSON.stringify(stripAnsi(errorMessage)));

  /* eslint-disable-next-line no-console */
  console.error(`\n${errorMessage}`);
}

/**
 * Sets up a middleware which runs all served js code through babel. Different babel configs
 * are loaded based on the server's configuration.
 *
 * @param {CompatibilityTransformMiddleware} cfg
 */
export function createCompatibilityTransformMiddleware(cfg) {
  const fileExtensions = [...DEFAULT_EXTENSIONS, ...cfg.extraFileExtensions];
  const compatibilityTransform = createCompatibilityTransform(cfg);

  /** @type {import('koa').Middleware} */
  async function compatibilityMiddleware(ctx, next) {
    const baseURL = ctx.url.split('?')[0].split('#')[0];
    if (isPolyfill(ctx.url) || !fileExtensions.some(ext => baseURL.endsWith(ext))) {
      return next();
    }
    await next();

    // should be a 2xx response
    if (ctx.status < 200 || ctx.status >= 300) {
      return undefined;
    }

    const filePath = getRequestFilePath(ctx, cfg.rootDir);

    // Ensure we respond with js content type
    ctx.response.set('content-type', 'text/javascript');

    try {
      const code = await getBodyAsString(ctx);
      const uaCompat = getUserAgentCompat(ctx);
      const transformedCode = await compatibilityTransform({
        uaCompat,
        filePath,
        code,
      });
      ctx.body = transformedCode;
      ctx.status = 200;
      return undefined;
    } catch (error) {
      // ResolveSyntaxError is thrown when resolveModuleImports runs into a syntax error from
      // the lexer, but babel didn't see any errors. this means either a bug in the lexer, or
      // some experimental syntax. log a message and return the module untransformed to the
      // browser
      if (error instanceof ResolveSyntaxError) {
        logError(
          `Could not resolve module imports in ${ctx.url}: Unable to parse the module, this can be due to experimental syntax or a bug in the parser.`,
        );
        return undefined;
      }

      let errorMessage = error.message;

      // replace babel error messages file path with the request url for readability
      if (errorMessage.startsWith(filePath)) {
        errorMessage = errorMessage.replace(filePath, ctx.url);
      }

      errorMessage = `Error compiling: ${errorMessage}`;

      // send compile error to browser for logging
      ctx.body = errorMessage;
      ctx.status = 500;
      logError(errorMessage);
    }
    return undefined;
  }

  return compatibilityMiddleware;
}
