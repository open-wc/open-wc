import minimatch from 'minimatch';
import stripAnsi from 'strip-ansi';
import { getBodyAsString, getRequestFilePath, isPolyfill } from '../utils/utils.js';
import { compatibilityModes, baseFileExtensions } from '../constants.js';
import { sendMessageToActiveBrowsers } from '../utils/message-channel.js';
import { resolveModuleImports, ResolveSyntaxError } from '../utils/resolve-module-imports.js';
import createBabelCompiler from '../utils/babel-compiler.js';

/**
 * @typedef {object} CompileMiddlewareConfig
 * @property {string} rootDir
 * @property {string[]} moduleDirectories
 * @property {boolean} readUserBabelConfig
 * @property {boolean} nodeResolve
 * @property {string} compatibilityMode
 * @property {object} [customBabelConfig]
 * @property {string[]} extraFileExtensions
 * @property {string[]} babelModernExclude patterns to exclude from modern babel compilation
 * @property {string[]} babelExclude patterns to exclude from all babel compilation
 * @property {boolean} preserveSymlinks
 * @property {boolean} experimentalHmr
 */

/**
 * Returns whether we should compile this file with babel.
 * @param {string} file
 * @param {boolean} legacy
 * @param {CompileMiddlewareConfig} cfg
 */
function shouldBabelCompile(file, legacy, cfg) {
  if (cfg.babelExclude.some(pattern => minimatch(file, pattern))) {
    return false;
  }

  return legacy || !cfg.babelModernExclude.some(pattern => minimatch(file, pattern));
}

/**
 * Creates babel compilers based on the configuration
 * @param {CompileMiddlewareConfig} cfg
 */
function createBabelCompilers(cfg) {
  // create the default compiler, enable the modern config if all or modern compatibility mode is on
  const compileModern = [compatibilityModes.MODERN, compatibilityModes.ALL].includes(
    cfg.compatibilityMode,
  );
  const compileDefault = compileModern || cfg.customBabelConfig || cfg.readUserBabelConfig || cfg.experimentalHmr;
  const compileLegacy = cfg.compatibilityMode === compatibilityModes.ALL;

  const defaultCompiler = compileDefault
    ? createBabelCompiler({ ...cfg, modern: compileModern, legacy: false, systemJs: false})
    : null;
  const legacy = compileLegacy || cfg.experimentalHmr
    ? createBabelCompiler({ ...cfg, modern: false, legacy: compileLegacy, systemJs: true })
    : null;

  return { defaultCompiler, legacy };
}

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
 * @param {CompileMiddlewareConfig} cfg
 */
export function createCompileMiddleware(cfg) {
  const fileExtensions = [...baseFileExtensions, ...cfg.extraFileExtensions];
  const babelCompilers = createBabelCompilers(cfg);

  /** @type {import('koa').Middleware} */
  async function compileMiddleware(ctx, next) {
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

    // we use the legacy compiler if the request ends with a legacy paramter
    const legacy = ctx.url.endsWith('?legacy=true');
    if (legacy && !babelCompilers.legacy) {
      logError(`Set compatibility mode to 'all' to compile for legacy browsers.`);
      return undefined;
    }

    // Ensure we respond with js content type
    ctx.response.set('content-type', 'text/javascript');

    try {
      const babelCompile = shouldBabelCompile(filePath, legacy, cfg);

      let code = await getBodyAsString(ctx);

      // do the default babel compilation, if configured
      if (babelCompile && babelCompilers.defaultCompiler) {
        code = await babelCompilers.defaultCompiler(filePath, code);
      }

      // resolve module imports, this isn't a babel plugin because if only node-resolve is configured,
      // we don't need to run babel which makes it a lot faster
      if (cfg.nodeResolve) {
        code = await resolveModuleImports(cfg.rootDir, filePath, code, {
          fileExtensions,
          moduleDirectories: cfg.moduleDirectories,
          preserveSymlinks: cfg.preserveSymlinks,
        });
      }

      // if this is a legacy request, compile to systemjs and es5. this isn't done in the first
      // babel pass, because we need valid es module syntax to resolve module imports first
      if (babelCompile && (legacy || cfg.experimentalHmr)) {
        code = await babelCompilers.legacy(filePath, code);
      }

      ctx.body = code;
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

  return compileMiddleware;
}
