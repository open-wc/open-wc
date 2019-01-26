#!/usr/bin/env node
const commandLineArgs = require('command-line-args');
const express = require('express');
const path = require('path');
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
    defaultValue: './',
    description: 'The root directory to serve files from. Defaults to the project root.',
  },
  {
    name: 'modules-dir',
    alias: 'm',
    type: String,
    description: 'Directory to resolve modules from. Default: node_modules',
  },
  { name: 'help', type: Boolean, description: 'See all options' },
];

const options = commandLineArgs(optionDefinitions);
if ('help' in options) {
  console.log(
    commandLineUsage({
      header: '@open-wc/dev-server',
      optionList: optionDefinitions,
    }),
  );
  return;
}

// open if the open option is given, even when there were no arguments
const shouldOpen = 'open' in options;
const {
  port,
  hostname,
  open,
  'root-dir': root,
  'app-index': appIndex,
  'modules-dir': modulesDir,
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
const transformOptions = { rootDir: root };
if (modulesDir) {
  transformOptions.modulesUrl = modulesDir;
}
app.use('*', transformMiddleware(transformOptions));

// serve static files
app.use(express.static(root));

// serve app index.html for non asset requests to allow for SPA routing
if (appIndex) {
  app.use(historyFallback(`${__dirname}/${appIndex}`));
}

app.listen(port, hostname, () => {
  let msg = `@open-wc/dev-server started on port ${port}. Serving files from '${root}'.`;
  if (shouldOpen) {
    msg += ` Opening browser on '${openPath}'`;
  }

  if (appIndex) {
    msg += ` Using history API fallback, redirecting requests to '${appIndex}'`;
  }

  console.log(msg);
});

// open browser if --open option was provided
if (shouldOpen) {
  opn(`http://${hostname}:${port}${openPath}`);
}
