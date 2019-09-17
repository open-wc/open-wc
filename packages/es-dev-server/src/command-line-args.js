/* eslint-disable import/no-dynamic-require, global-require */
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import path from 'path';
import camelcase from 'camelcase';
import fs from 'fs';
import deepmerge from 'deepmerge';

/**
 * Reads command line args from arguments array. Defaults to `process.argv`.
 *
 * @param {string[]} [argv]
 * @returns {import('./config.js').Config}
 */
export function readCommandLineArgs(argv = process.argv) {
  const optionDefinitions = [
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
      name: 'key',
      type: String,
      description: 'Path to local .key file for https',
    },
    {
      name: 'cert',
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
      description: 'Compatibility mode for older browsers. Can be: "esm", modern" or "all"',
    },
    { name: 'help', type: Boolean, description: 'See all options' },
  ];

  const dashesArgs = commandLineArgs(optionDefinitions, { argv, partial: true });
  const openInCommandLineArgs = 'open' in dashesArgs;

  // convert kebab-case to camelCase
  /** @type {object} */
  const args = Object.keys(dashesArgs).reduce((acc, key) => {
    acc[camelcase(key)] = dashesArgs[key];
    return acc;
  }, {});

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
          optionList: optionDefinitions,
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
  } else {
    // read default config if present
    const defaultConfigPath = path.join(process.cwd(), 'es-dev-server.config.js');
    if (fs.existsSync(defaultConfigPath) && fs.statSync(defaultConfigPath).isFile()) {
      const fileConfig = require(defaultConfigPath);
      options = deepmerge(fileConfig, args);
    } else {
      // no file config, just command line args
      options = args;
    }
  }

  let { open } = options;

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
