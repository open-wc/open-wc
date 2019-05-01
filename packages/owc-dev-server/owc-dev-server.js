#!/usr/bin/env node

/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const browserSync = require('browser-sync');
const connectBrowserSync = require('connect-browser-sync');
const express = require('express');
const path = require('path');
const fs = require('fs');
const opn = require('opn');
const transformMiddleware = require('express-transform-bare-module-specifiers').default;
const historyFallback = require('express-history-api-fallback');
const commandLineUsage = require('command-line-usage');

const optionDefinitions = [
  {
    name: 'port',
    alias: 'p',
    type: Number,
    defaultValue: 8080,
    description: 'The port to use. Default: 8080',
  },
  {
    name: 'hostname',
    alias: 'h',
    type: String,
    defaultValue: 'localhost',
    description: 'The hostname to use. Default: localhost',
  },
  {
    name: 'open',
    alias: 'o',
    type: String,
    description: 'Opens the default browser on the given path or default /',
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
    defaultOption: true,
    defaultValue: './',
    description: 'The root directory to serve files from. Defaults to the project root.',
  },
  {
    name: 'modules-dir',
    alias: 'm',
    type: String,
    description: 'Directory to resolve modules from. Default: node_modules',
  },
  {
    name: 'config-file',
    alias: 'c',
    type: String,
    defaultValue: path.join(process.cwd(), '.owc-dev-server.config.js'),
    description: 'Node file which can provide additional config',
  },
  { name: 'help', type: Boolean, description: 'See all options' },
  {
    name: 'sync',
    alias: 's',
    type: Boolean,
    defaultValue: true,
    description: 'Wether or not to auto reload the browser. Default: true',
  },
];

const options = commandLineArgs(optionDefinitions);
if ('help' in options) {
  console.log(
    commandLineUsage([
      {
        header: 'owc-dev-server',
        content: `
          Simply server with node resolution for bare modules.

          Usage: \`owc-dev-server <root-dir> [options...]\`
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

// open if the open option is given, even when there were no arguments
const shouldOpen = 'open' in options;
const {
  port,
  hostname,
  open,
  'root-dir': rootDir,
  'app-index': appIndex,
  'modules-dir': modulesDir,
  'config-file': configFilePath,
  sync,
} = options;

let openPath;
if (open) {
  // user-provided open path
  openPath = path.normalize(open);
} else if (appIndex) {
  // if an appIndex was provided, use it's directory as open path
  openPath = `${path.parse(appIndex).dir}/`;
} else {
  // default to working directory root
  openPath = '/';
}

// make sure path properly starts a /
if (!openPath.startsWith('/')) {
  openPath = `/${openPath}`;
}

const app = express();

// transform node-style imports to browser-style imports
const transformOptions = { rootDir };
if (modulesDir) {
  const fullModulesPath = path.join(rootDir, modulesDir);
  if (!fs.existsSync(fullModulesPath)) {
    throw new Error(
      `Could not find "${fullModulesPath}". The modules dir needs to be a subfolder of root dir.`,
    );
  }

  transformOptions.modulesUrl = modulesDir;
}
app.use('*', transformMiddleware(transformOptions));

if (sync) {
  const bs = browserSync.create().init({
    logLevel: 'silent',
    files: rootDir,
    notify: false,
  });
  app.use(connectBrowserSync(bs));
}
// serve static files
app.use(express.static(rootDir));

// serve app index.html for non asset requests to allow for SPA routing
if (appIndex) {
  const fullAppIndexPath = `${process.cwd()}/${appIndex}`;
  if (!fs.existsSync(fullAppIndexPath)) {
    throw new Error(`Could not find "${fullAppIndexPath}". The apps index file needs to exist.`);
  }
  if (!fs.lstatSync(fullAppIndexPath).isFile()) {
    throw new Error(
      `The apps index file needs to be a file. Provided path: "${fullAppIndexPath}".`,
    );
  }
  app.use(historyFallback(fullAppIndexPath));
}

// load additonal config file for express
if (fs.existsSync(configFilePath)) {
  const appConfig = require(configFilePath); // eslint-disable-line import/no-dynamic-require, global-require
  appConfig(app);
}

app.listen(port, hostname, () => {
  const msgs = [];
  msgs.push(`owc-dev-server started on http://${hostname}:${port}`);
  msgs.push(`  Serving files from '${rootDir}'.`);
  if (shouldOpen) {
    msgs.push(`  Opening browser on '${openPath}'`);
  }

  if (appIndex) {
    msgs.push(`  Using history API fallback, redirecting requests to '${appIndex}'`);
  }

  if (modulesDir) {
    const fullModulesPath = path.join(rootDir, modulesDir);
    msgs.push(`  Using "${fullModulesPath}" as modules dir`);
  }

  console.log(msgs.join('\n'));
});

// open browser if --open option was provided
if (shouldOpen) {
  opn(`http://${hostname}:${port}${openPath}`);
}
