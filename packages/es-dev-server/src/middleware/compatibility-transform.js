/** @typedef {import('./compatibility-transform-types').CompatibilityTransformMiddleware} CompatibilityTransformMiddleware */

import stripAnsi from 'strip-ansi';
import {
  getBodyAsString,
  getRequestFilePath,
  isPolyfill,
  RequestCancelledError,
  shoudlTransformToModule,
  logDebug,
} from '../utils/utils.js';
import { sendMessageToActiveBrowsers } from '../utils/message-channel.js';
import { ResolveSyntaxError } from '../utils/resolve-module-imports.js';
import { getUserAgentCompat } from '../utils/user-agent-compat.js';

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
  /** @type {import('koa').Middleware} */
  async function compatibilityMiddleware(ctx, next) {
    const baseURL = ctx.url.split('?')[0].split('#')[0];
    if (isPolyfill(ctx.url) || !cfg.fileExtensions.some(ext => baseURL.endsWith(ext))) {
      return next();
    }

    if (ctx.headers.accept.includes('text/html')) {
      return next();
    }

    await next();

    // should be a 2xx response
    if (ctx.status < 200 || ctx.status >= 300) {
      return undefined;
    }
    const transformModule = shoudlTransformToModule(ctx.url);
    const filePath = getRequestFilePath(ctx, cfg.rootDir);
    // if there is no file path, this file was not served statically
    if (!filePath) {
      return undefined;
    }

    // Ensure we respond with js content type
    ctx.response.set('content-type', 'text/javascript');

    try {
      const code = await getBodyAsString(ctx);
      const uaCompat = getUserAgentCompat(ctx);
      const transformedCode = await cfg.transformJs({
        uaCompat,
        filePath,
        code,
        transformModule,
      });
      ctx.body = transformedCode;
      ctx.status = 200;
      return undefined;
    } catch (error) {
      if (error instanceof RequestCancelledError) {
        return undefined;
      }

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

      logDebug(error);

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
