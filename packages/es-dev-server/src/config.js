import path from 'path';
import { toBrowserPath } from './utils/utils.js';
import { compatibilityModes } from './constants.js';

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
 * @property {import('koa').Middleware[]} [middlewares]
 * @property {boolean} logStartup whether to log server startup
 *
 * Development help
 * @property {boolean} [watch] whether to watch served files and reload the browser on change
 * @property {boolean} [http2] whether to run the server in http2, sets up https as well
 * @property {boolean} [experimentalHmr] whether to enable hot module replacement
 *
 * Code transformation
 * @property {string} [compatibility] compatibility mode for older browsers. Can be: "esm", modern" or "all"
 * @property {boolean} [nodeResolve] whether to resolve bare module imports using node resolve
 * @property {boolean} [preserveSymlinks] preserve symlinks when resolving modules. Default false,
 *  which is the default node behavior.
 * @property {string[]} [moduleDirs] directories to resolve modules from when using nodeResolve
 *   should be directory names, not paths to directories as node resolve will try to recursively
 *   find directories with these names
 * @property {boolean} [babel] whether to use the user's .babelrc babel config
 * @property {string[]} [fileExtensions] file extensions to run babel on
 * @property {string[]} [babelExclude] files excluded from all babel compilation
 * @property {string[]} [babelModernExclude] files excluded from babel on modern browser
 * @property {object} [babelConfig] babel config to use, this is useful when you want to provide a
 *   babel config from a tool, and don't want to require all users to use the same babel config
 */

/**
 * Internal config data structure, constructed from the public config
 * @typedef {object} InternalConfig
 *
 * Server configuration
 * @property {number} port
 * @property {string} hostname
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
 *
 * Development help
 * @property {boolean} watch
 * @property {number} watchDebounce
 * @property {boolean} http2
 * @property {boolean} experimentalHmr
 *
 * Code transformation
 * @property {string[]} moduleDirectories
 * @property {boolean} nodeResolve
 * @property {boolean} preserveSymlinks
 * @property {boolean} readUserBabelConfig same as babel option in command line args
 * @property {string} compatibilityMode
 * @property {object} customBabelConfig custom babel configuration to use when compiling
 * @property {string[]} extraFileExtensions
 * @property {string[]} babelExclude
 * @property {string[]} babelModernExclude
 */

/**
 * Creates dev server config with default settings
 * @param {Partial<Config>} config
 * @returns {InternalConfig}
 */
export function createConfig(config) {
  const {
    port,
    hostname = '127.0.0.1',
    open = false,
    basePath,
    watch = false,
    http2 = false,
    compatibility = compatibilityModes.NONE,
    nodeResolve = false,
    preserveSymlinks = false,
    moduleDirs = ['node_modules'],
    babel = false,
    experimentalHmr = false,
    fileExtensions = [],
    babelExclude = [],
    babelModernExclude = [],
    babelConfig,
    logStartup,
  } = config;

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
    openPath = path.normalize(open);
  } else if (appIndex) {
    // if an appIndex was provided, use it's directory as open path
    openPath = `${basePath || ''}${appIndexDir}/`;
  } else {
    openPath = basePath ? `${basePath}/` : '/';
  }

  // make sure path properly starts a /
  if (!openPath.startsWith('/')) {
    openPath = `/${openPath}`;
  }

  return {
    port,
    hostname,
    rootDir,
    appIndexDir,
    appIndex,
    basePath,
    moduleDirectories: moduleDirs,
    nodeResolve,
    preserveSymlinks,
    readUserBabelConfig: babel,
    customBabelConfig: babelConfig,
    experimentalHmr,
    watch,
    openBrowser: open === true || typeof open === 'string',
    openPath,
    logStartup,
    http2,
    extraFileExtensions: fileExtensions,
    compatibilityMode: compatibility,
    babelExclude,
    babelModernExclude,
    watchDebounce: 100,
    customMiddlewares: middlewares,
  };
}
