const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const path = require('path');

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
    name: 'watch',
    alias: 'w',
    type: Boolean,
    defaultValue: false,
    description: 'Whether to watch served files and reload the browser on changes',
  },
  {
    name: 'config-file',
    alias: 'c',
    type: String,
    defaultValue: path.join(process.cwd(), '.owc-dev-server.config.js'),
    description: 'Node file which can provide additional config',
  },
  { name: 'help', type: Boolean, description: 'See all options' },
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
  watch,
  'root-dir': rootDir,
  'app-index': appIndex,
  'modules-dir': modulesDir,
  'config-file': configFilePath,
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

module.exports = {
  port,
  hostname,
  open,
  watch,
  rootDir,
  appIndex,
  modulesDir,
  configFilePath,
  shouldOpen,
  openPath,
};
