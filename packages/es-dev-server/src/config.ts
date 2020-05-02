import path from 'path';
import { Middleware } from 'koa';
import { defaultFileExtensions } from '@open-wc/building-utils';
import { Options as NodeResolveOptions } from '@rollup/plugin-node-resolve';
import { PolyfillsLoaderConfig } from './utils/inject-polyfills-loader';
import { toBrowserPath, setDebug } from './utils/utils';
import { compatibilityModes } from './constants';
import { ResponseTransformer } from './middleware/response-transform';
import { TransformOptions, Node } from '@babel/core';

// Config object for Koa compress middleware
export interface CompressOptions {
  // Minimum response size in bytes to compress. Default 1024 bytes or 1kb.
  threshold?: number;
  // An optional function that checks the response content type to decide whether to compress. By default, it uses compressible.
  filter?: (contentType: string) => boolean;
}

// Public config, to be defined by the user.
export interface Config {
  // Server configuration

  /** the port to run the server on */
  port?: number;
  /** the hostname to run the server on */
  hostname?: string;
  /**
   * if boolean: whether to open the browser on startup,
   * if string: what path to open the browser on. if it's a boolean, the open path is
   * determined by root dir + app index (if any)
   */
  open?: boolean | string;
  /**
   * file path to the index of your application, will serve this
   * index when requesting non-existing paths to enable SPA routing / history API fallback.
   * can be an absolute file path, or a path relative to the root dir
   */
  appIndex?: string;
  /**
   * root directory to set up the web server, any served files must
   * be within the scope of this folder
   */
  rootDir?: string;
  /**
   * Base path the app is served on. This path is only visible in
   * the browser, it is stripped from the request url before resolving files. Starts with a /
   * and ends with no/. For example: /my-app, /foo, /foo/bar
   */
  basePath?: string;
  /** Whether the server should compress responses. */
  compress?: boolean | CompressOptions;
  /** Middleware to inject into the server. */
  middlewares?: Middleware[];
  responseTransformers?: ResponseTransformer[];
  /** whether to log server startup */
  logStartup?: boolean;
  /** whether to log debug messages */
  debug?: boolean;

  // Development help

  /** whether to watch served files and reload the browser on change */
  watch?: boolean;
  /** whether to log errors to the browser */
  logErrorsToBrowser?: boolean;
  /** whether to run the server in http2, sets up https as well */
  http2?: boolean;
  /** path to local .key file to use for https */
  sslKey?: string;
  /** path to local .cert file to use for https */
  sslCert?: string;

  // Code transformation

  /**
   * compatibility mode for older browsers. Can be: "auto", "min",
   * "max" or "none". Defaults to "auto"
   */
  compatibility?: string;
  /** whether to resolve bare module imports using node resolve */
  nodeResolve?: boolean | NodeResolveOptions;
  /**
   * dedupe ensures only one
   * version of a module is ever resolved by resolving it from the root node_modules.
   */
  dedupeModules?: boolean | string[] | ((importee: string) => boolean);
  /** configuration for the polyfills loader */
  polyfillsLoader?: Partial<PolyfillsLoaderConfig>;
  /**
   * preserve symlinks when resolving modules. Default false,
   * which is the default node behavior.
   */
  preserveSymlinks?: boolean;
  /**
   * directories to resolve modules from when using nodeResolve
   * should be directory names, not paths to directories as node resolve will try to recursively
   * find directories with these names
   */
  moduleDirs?: string[];
  /** whether to use the user's .babelrc babel config */
  babel?: boolean;
  /** file extensions to run babel on */
  fileExtensions?: string[];
  /** files excluded from all babel compilation */
  babelExclude?: string[];
  /** files excluded from babel on modern browser */
  babelModernExclude?: string[];
  /** files excluded from module transfomration */
  babelModuleExclude?: string[];
  /**
   * babel config to use, this is useful when you want to provide a
   * babel config from a tool, and don't want to require all users to use the same babel config
   */
  babelConfig?: TransformOptions;
  /**
   * callback called before the server is
   * started, the returned promise is awaited
   */
  onServerStart?: (config: ParsedConfig) => void | Promise<void>;
}

// Internal config data structure, constructed from the public config
export interface ParsedConfig {
  // Server configuration
  port?: number;
  hostname?: string;
  openBrowser: boolean;
  openPath: string;
  appIndex?: string;
  appIndexDir?: string;
  basePath?: string;
  rootDir: string;
  logStartup: boolean;
  customMiddlewares: Middleware[];
  responseTransformers: ResponseTransformer[];
  onServerStart?: (config: ParsedConfig) => void | Promise<void>;

  // Development help
  watch: boolean;
  logErrorsToBrowser: boolean;
  watchDebounce: number;
  http2: boolean;
  sslKey?: string;
  sslCert?: string;

  // Code transformation
  nodeResolve: boolean | NodeResolveOptions;
  polyfillsLoaderConfig?: Partial<PolyfillsLoaderConfig>;
  readUserBabelConfig: boolean;
  compatibilityMode: string;
  compress: boolean | CompressOptions;
  customBabelConfig?: TransformOptions;
  fileExtensions: string[];
  babelExclude: string[];
  babelModernExclude: string[];
  babelModuleExclude: string[];
}

/**
 * Creates dev server config with default settings
 */
export function createConfig(config: Partial<Config>): ParsedConfig {
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
    responseTransformers = [],
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
  const middlewares = config.middlewares || (config as any).customMiddlewares;

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
    logStartup: !!logStartup,
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
