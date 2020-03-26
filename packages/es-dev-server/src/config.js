/** @typedef {import('./utils/inject-polyfills-loader-types').PolyfillsLoaderConfig} PolyfillsLoaderConfig */

import path from 'path';
import { defaultFileExtensions } from '@open-wc/building-utils';
import { toBrowserPath, setDebug } from './utils/utils.js';
import { compatibilityModes } from './constants.js';

/**
 * @typedef {import('@rollup/plugin-node-resolve').Options} NodeResolveOptions
 */

/**
 * Public config, to be defined by the user.
 * @typedef {Object} Config
 *
 * Server configuration
 * @property {number} [port] the port to run the server on
 * @property {string} [hostname] the hostname to run the server on
 * @property {boolean | string} [open] if boolean: whether to open the browser on startup,
 *   if string: what path to open the browser on. if it's a boolean, the open path is
 *   determined by root dir + app index (if any)
 * @property {string} [appIndex] file path to the index of your application, will serve this
 *   index when requesting non-existing paths to enable SPA routing / history API fallback.
 *   can be an absolute file path, or a path relative to the root dir
 * @property {string} [rootDir] root directory to set up the web server, any served files must
 *   be within the scope of this folder
 * @property {string} [basePath] Base path the app is served on. This path is only visible in
 *   the browser, it is stripped from the request url before resolving files. Starts with a /
 *   and ends with no/. For example: /my-app, /foo, /foo/bar
 * @property {boolean|CompressOptions} [compress=true] Whether the server should compress responses.
 * @property {import('koa').Middleware[]} [middlewares]
 * @property {import('./middleware/response-transform').ResponseTransformer[]} responseTransformers
 * @property {boolean} logStartup whether to log server startup
 * @property {boolean} debug whether to log debug messages
 *
 * Development help
 * @property {boolean} [watch] whether to watch served files and reload the browser on change
 * @property {boolean} [logErrorsToBrowser] whether to log errors to the browser
 * @property {boolean} [http2] whether to run the server in http2, sets up https as well
 * @property {string} [sslKey] path to local .key file to use for https
 * @property {string} [sslCert] path to local .cert file to use for https
 *
 * Code transformation
 * @property {string} [compatibility] compatibility mode for older browsers. Can be: "auto", "min",
 *  "max" or "none". Defaults to "auto"
 * @property {boolean | NodeResolveOptions} [nodeResolve] whether to resolve bare module imports using node resolve
 * @property {boolean | string[] | ((importee: string) => boolean)} dedupeModules dedupe ensures only one
 *   version of a module is ever resolved by resolving it from the root node_modules.
 * @property {Partial<PolyfillsLoaderConfig>} [polyfillsLoader] configuration for the polyfills loader
 * @property {boolean} [preserveSymlinks] preserve symlinks when resolving modules. Default false,
 *  which is the default node behavior.
 * @property {string[]} [moduleDirs] directories to resolve modules from when using nodeResolve
 *   should be directory names, not paths to directories as node resolve will try to recursively
 *   find directories with these names
 * @property {boolean} [babel] whether to use the user's .babelrc babel config
 * @property {string[]} [fileExtensions] file extensions to run babel on
 * @property {string[]} [babelExclude] files excluded from all babel compilation
 * @property {string[]} [babelModernExclude] files excluded from babel on modern browser
 * @property {string[]} [babelModuleExclude] files excluded from module transfomration
 * @property {object} [babelConfig] babel config to use, this is useful when you want to provide a
 *   babel config from a tool, and don't want to require all users to use the same babel config
 * @property {(config: InternalConfig) => void | Promise<void>} onServerStart callback called before the server is
 *   started, the returned promise is awaited
 */

/**
 * Config object for Koa compress middleware
 * @typedef {object} CompressOptions
 * @property {number} [threshold=1024] Minimum response size in bytes to compress. Default 1024 bytes or 1kb.
 * @property {function} [filter] An optional function that checks the response content type to decide whether to compress. By default, it uses compressible.
 */

/**
 * Internal config data structure, constructed from the public config
 * @typedef {object} InternalConfig
 *
 * Server configuration
 * @property {number} port
 * @property {string} [hostname]
 * @property {boolean} openBrowser whether to open the browser
 * @property {string} openPath path to open the browser on
 * @property {string} [appIndex] app index browser path, generated from
 *   appIndex file path
 * @property {string} [appIndexDir] app index browser directory, generated from
 *   appIndex file path and root dir
 * @property {string} basePath
 * @property {string} rootDir
 * @property {boolean} logStartup whether to log a startup message
 * @property {import('koa').Middleware[]} customMiddlewares
 * @property {import('./middleware/response-transform').ResponseTransformer[]} responseTransformers
 * @property {(config: InternalConfig) => void | Promise<void>} onServerStart callback called before the server is
 *   started, the returned promise is awaited
 *
 * Development help
 * @property {boolean} watch
 * @property {boolean} logErrorsToBrowser
 * @property {number} watchDebounce
 * @property {boolean} http2
 * @property {string} sslKey
 * @property {string} sslCert
 *
 * Code transformation
 * @property {boolean | NodeResolveOptions} nodeResolve
 * @property {Partial<PolyfillsLoaderConfig>} polyfillsLoaderConfig
 * @property {boolean} readUserBabelConfig same as babel option in command line args
 * @property {string} compatibilityMode
 * @property {boolean|CompressOptions} compress Whether the server should compress responses.
 * @property {object} customBabelConfig custom babel configuration to use when compiling
 * @property {string[]} fileExtensions
 * @property {string[]} babelExclude
 * @property {string[]} babelModernExclude
 * @property {string[]} babelModuleExclude
 */

/**
 * Creates dev server config with default settings
 * @param {Partial<Config>} config
 * @returns {InternalConfig}
 */
export function createConfig(config) {
  const {
    babel = false,
    babelConfig,
    babelExclude = [],
    babelModernExclude = [],
    babelModuleExclude = [],
    basePath,
    compress = true,
    fileExtensions: fileExtensionsArg,
    hostname,
    http2 = false,
    logStartup,
    open = false,
    port,
    sslCert,
    sslKey,
    watch = false,
    logErrorsToBrowser = false,
    polyfillsLoader,
    responseTransformers,
    debug = false,
    nodeResolve: nodeResolveArg = false,
    dedupeModules,
    moduleDirs = ['node_modules', 'web_modules'],
    preserveSymlinks = false,
    onServerStart,
  } = config;

  if (debug) {
    setDebug(true);
  }

  let { compatibility = compatibilityModes.AUTO } = config;

  if (compatibility === 'modern' || compatibility === 'all') {
    /* eslint-disable-next-line no-console */
    console.warn(
      '[es-dev-server] Compatibility mode "modern" and "all" are deprecated, and combined into "auto".' +
        '"auto" mode is turned on by default.',
    );
    compatibility = compatibilityModes.AUTO;
  }

  if (!Object.values(compatibilityModes).includes(compatibility)) {
    throw new Error(`Unknown compatibility mode: ${compatibility}`);
  }

  // middlewares used to be called customMiddlewares
  // @ts-ignore
  const middlewares = config.middlewares || config.customMiddlewares;

  let { appIndex, rootDir = process.cwd() } = config;
  let appIndexDir;

  // ensure rootDir is a fully resolved path, for example if you set ../../
  // in the config or cli, it's resolved relative to the current working directory
  rootDir = path.resolve(rootDir);

  // resolve appIndex relative to rootDir and transform it to a browser path
  if (appIndex) {
    if (path.isAbsolute(appIndex)) {
      appIndex = `/${toBrowserPath(path.relative(rootDir, appIndex))}`;
    } else if (!appIndex.startsWith('/')) {
      appIndex = `/${toBrowserPath(appIndex)}`;
    } else {
      appIndex = toBrowserPath(appIndex);
    }

    appIndexDir = `${appIndex.substring(0, appIndex.lastIndexOf('/'))}`;
  }

  // parse `open` option, based on whether it's a boolean or a string
  let openPath;
  if (typeof open === 'string' && open !== '') {
    // user-provided open path
    openPath = open;
  } else if (appIndex) {
    // if an appIndex was provided, use it's directory as open path
    openPath = `${basePath || ''}${appIndexDir}/`;
  } else {
    openPath = basePath ? `${basePath}/` : '/';
  }

  const fileExtensions = [...(fileExtensionsArg || []), ...defaultFileExtensions];

  /** @type {boolean | NodeResolveOptions} */
  let nodeResolve = nodeResolveArg;
  // some node resolve options can be set separately for convenience, primarily
  // for the command line args. we merge them into a node resolve options object
  if (
    nodeResolveArg != null &&
    nodeResolveArg !== false &&
    (moduleDirs != null || preserveSymlinks != null || dedupeModules != null)
  ) {
    nodeResolve = {
      // user provided options, if any
      ...(typeof nodeResolveArg === 'object' ? nodeResolveArg : {}),
      customResolveOptions: {
        moduleDirectory: moduleDirs,
        preserveSymlinks,
      },
    };

    if (dedupeModules) {
      nodeResolve.dedupe =
        dedupeModules === true ? importee => !['.', '/'].includes(importee[0]) : dedupeModules;
    }
  }

  return {
    appIndex,
    appIndexDir,
    babelExclude,
    babelModernExclude,
    babelModuleExclude,
    basePath,
    compatibilityMode: compatibility,
    polyfillsLoaderConfig: polyfillsLoader,
    compress,
    customBabelConfig: babelConfig,
    customMiddlewares: middlewares,
    responseTransformers,
    fileExtensions,
    hostname,
    http2,
    logStartup,
    nodeResolve,
    openBrowser: open === true || typeof open === 'string',
    openPath,
    port,
    readUserBabelConfig: babel,
    rootDir,
    sslCert,
    sslKey,
    watch,
    logErrorsToBrowser,
    watchDebounce: 100,
    onServerStart,
  };
}
