#!/usr/bin/env node
/* eslint-disable import/no-dynamic-require, global-require */
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import path from 'path';
import camelcase from 'camelcase';
import fs from 'fs';
import deepmerge from 'deepmerge';
import { startServer } from './server.js';

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
    description: 'Serve files over HTTP2. Sets up HTTPS with self-signed certificates..',
  },
  {
    name: 'node-resolve',
    alias: 'n',
    type: Boolean,
    description: 'Resolve bare import imports using node resolve.',
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
    description: 'Extra file extentions to use when transforming code.',
  },
  {
    name: 'compatibility',
    type: String,
    description: 'Compatibility mode for older browsers. Can be: "esm", modern" or "all"',
  },
  { name: 'help', type: Boolean, description: 'See all options' },
];

const dashesArgs = commandLineArgs(optionDefinitions);

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
          Simply server with node resolution for bare modules.

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

// open if the open option is given, even when there were no arguments
const openBrowser = 'open' in options;
let openPath;
if (typeof options.open === 'string' && options.open !== '') {
  // user-provided open path
  openPath = path.normalize(options.open);
} else if (options.appIndex) {
  // if an appIndex was provided, use it's directory as open path
  openPath = `${path.parse(options.appIndex).dir}/`;
} else {
  // default to working directory root
  openPath = '/';
}

// make sure path properly starts a /
if (!openPath.startsWith('/')) {
  openPath = `/${openPath}`;
}

startServer({
  openBrowser,
  openPath,
  port: options.port,
  hostname: options.hostname,
  watch: options.watch,
  rootDir: options.rootDir,
  appIndex: options.appIndex,
  nodeResolve: options.nodeResolve,
  http2: options.http2,
  compatibilityMode: options.compatibility,
  readUserBabelConfig: options.babel,
  customMiddlewares: options.customMiddlewares,
  extraFileExtensions: options.fileExtensions,
  moduleDirectories: options.moduleDirs,
  logStartup: true,
});
