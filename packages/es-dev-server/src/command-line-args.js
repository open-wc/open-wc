/* eslint-disable import/no-dynamic-require, global-require */
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import path from 'path';
import camelcase from 'camelcase';
import fs from 'fs';
import deepmerge from 'deepmerge';
import { setDebug, logDebug } from './utils/utils.js';

export const commandLineOptions = [
  {
    name: 'config',
    alias: 'c',
    type: String,
    description:
      'The file to read configuration from (js or json). Config entries are camelCases flags.',
  },
  {
    name: 'port',
    alias: 'p',
    type: Number,
    description: 'The port to use. Default: 8080',
  },
  {
    name: 'hostname',
    alias: 'h',
    type: String,
    description: 'The hostname to use. Default: localhost',
  },
  {
    name: 'open',
    alias: 'o',
    type: String,
    description: 'Opens the browser on app-index, root dir or a custom path.',
  },
  {
    name: 'app-index',
    alias: 'a',
    type: String,
    description:
      "The app's index.html file. When set, serves the index.html for non-file requests. Use this to enable SPA routing.",
  },
  {
    name: 'root-dir',
    alias: 'r',
    type: String,
    description:
      'The root directory to serve files from. Defaults to the current working directory.',
  },
  {
    name: 'base-path',
    type: String,
    description:
      'Base path the app is served on. This path is only visible in the browser, it is stripped from the request url before resolving files. ' +
      'Starts with a / and ends with no/. For example: /my-app, /foo, /foo/bar',
  },
  {
    name: 'module-dirs',
    alias: 'm',
    type: String,
    multiple: true,
    description: 'Directories to resolve modules from. Used by node-resolve',
  },
  {
    name: 'watch',
    alias: 'w',
    type: Boolean,
    description: 'Reload the browser when files are edited.',
  },
  {
    name: 'watch-excludes',
    type: Boolean,
    description: 'Globs to exclude from file watching. Default: node_modules/**',
  },
  {
    name: 'http2',
    alias: 't',
    type: Boolean,
    description:
      'Serve files over HTTP2. Sets up HTTPS with self-signed certificates or optional custom certificates',
  },
  {
    name: 'ssl-key',
    type: String,
    description: 'Path to local .key file for https',
  },
  {
    name: 'ssl-cert',
    type: String,
    description: 'Path to local .cert file for https',
  },
  {
    name: 'node-resolve',
    alias: 'n',
    type: Boolean,
    description: 'Resolve bare import imports using node resolve.',
  },
  {
    name: 'dedupe',
    alias: 'd',
    type: Boolean,
    description:
      'Dedupe modules by resolving them always from the root, ensuring only one version of a package is ever resolved.',
  },
  {
    name: 'preserve-symlinks',
    type: Boolean,
    description:
      'Preserve symlinks when resolving modules. Default false, which is the default node behavior.',
  },
  {
    name: 'babel',
    alias: 'b',
    type: Boolean,
    description: 'Transform served code through babel. Requires .babelrc',
  },
  {
    name: 'file-extensions',
    type: String,
    multiple: true,
    description: 'Extra file extentions to use when transforming code.',
  },
  {
    name: 'babel-exclude',
    type: String,
    multiple: true,
    description: 'Patterns of files to exclude from babel compilation.',
  },
  {
    name: 'babel-modern-exclude',
    type: String,
    multiple: true,
    description: 'Patterns of files to exclude from babel compilation on modern browsers.',
  },
  {
    name: 'compatibility',
    type: String,
    description:
      'Compatibility mode for older browsers. Can be: "auto", "always", "min", "max" or "none". Default "auto"',
  },
  {
    name: 'polyfills',
    type: String,
    description: 'Polyfills to load for older browsers. Can be "auto" or "none". Default "auto"',
  },
  {
    name: 'debug',
    type: Boolean,
    description: 'Whether to log debug messages',
  },
  { name: 'help', type: Boolean, description: 'See all options' },
];

/**
 * Reads command line args from arguments array. Defaults to `process.argv`.
 *
 * @param {string[]} [argv]
 * @param {{ defaultConfigDir?: string }} config
 * @returns {import('./config.js').Config}
 */
export function readCommandLineArgs(argv = process.argv, config = {}) {
  const { defaultConfigDir = process.cwd() } = config;
  const dashesArgs = commandLineArgs(commandLineOptions, { argv, partial: true });
  const openInCommandLineArgs = 'open' in dashesArgs;

  // convert kebab-case to camelCase
  /** @type {object} */
  const args = Object.keys(dashesArgs).reduce((acc, key) => {
    acc[camelcase(key)] = dashesArgs[key];
    return acc;
  }, {});

  if (args.debug) {
    setDebug(true);
  }

  if ('help' in args) {
    /* eslint-disable-next-line no-console */
    console.log(
      commandLineUsage([
        {
          header: 'es-dev-server',
          content: `
          A dev server for modern web development workflows.

          Usage: \`es-dev-server [options...]\`
        `.trim(),
        },
        {
          header: 'Global Options',
          optionList: commandLineOptions,
        },
      ]),
    );
    process.exit();
  }

  let options;

  if (args.config) {
    // read config from user provided path
    const configPath = path.resolve(args.config);
    if (!fs.existsSync(configPath) || !fs.statSync(configPath).isFile()) {
      throw new Error(`Did not find any config file at ${configPath}`);
    }

    const fileConfig = require(configPath);
    options = deepmerge(fileConfig, args);
    logDebug(`Found a config file at ${configPath}`);
  } else {
    // read default config if present
    const defaultConfigPath = path.join(defaultConfigDir, 'es-dev-server.config.js');
    if (fs.existsSync(defaultConfigPath) && fs.statSync(defaultConfigPath).isFile()) {
      const fileConfig = require(defaultConfigPath);
      options = deepmerge(fileConfig, args);
      logDebug(`Found a default config file at ${defaultConfigPath}`);
    } else {
      // no file config, just command line args
      options = args;
      logDebug(`Did not find a default config file at ${defaultConfigPath}`);
    }
  }

  let { open } = options;

  if (options.dedupe) {
    options.dedupeModules = options.dedupe;
    delete options.dedupe;
  }

  // open can be a boolean nor a string. if it's a boolean from command line args,
  // it's passed as null. so if it's not a string or boolean type, we check for the
  // existence of open in the args object, and treat that as true
  if (typeof open !== 'string' && typeof open !== 'boolean' && openInCommandLineArgs) {
    open = true;
  }

  return {
    ...options,
    open,
    logStartup: true,
    // when used from the command line we log compile errors to the browser,
    // not to the terminal for a better UX
    logCompileErrors: false,
  };
}
