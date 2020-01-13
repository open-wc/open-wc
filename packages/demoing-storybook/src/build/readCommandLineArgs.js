/* eslint-disable import/no-dynamic-require, global-require */
const commandLineArgs = require('command-line-args');
const path = require('path');
const deepmerge = require('deepmerge');
const fs = require('fs');
const readMainJs = require('../shared/readMainJs');

// default values for non-cli only options
const defaultConfig = {
  managerPath: '@open-wc/storybook-prebuilt/dist/manager.js',
  previewPath: '@open-wc/storybook-prebuilt/dist/preview.js',
  defaultValue: 'storybook-static',
};

/**
 * @param {object} args
 */
function dashToCamelArgs(args) {
  const config = {};
  if ('config-dir' in args) {
    config.configDir = args['config-dir'];
  }
  if ('output-dir' in args) {
    config.outputDir = args['output-dir'];
  }
  if ('stories' in args) {
    config.managerPath = args.stories;
  }
  if ('manager-path' in args) {
    config.managerPath = args['manager-path'];
  }
  if ('preview-path' in args) {
    config.previewPath = args['preview-path'];
  }
  return config;
}

module.exports = function readCommandLineArgs() {
  const optionDefinitions = [
    {
      name: 'config-dir',
      alias: 'c',
      type: String,
      defaultValue: './.storybook',
      description: 'Location of storybook configuration directory',
    },
    {
      name: 'config',
      type: String,
      description: 'Name of the storybook build configuration file',
    },
    {
      name: 'output-dir',
      alias: 'o',
      type: String,
      description: 'Rollup build output directory',
    },
    {
      name: 'stories',
      alias: 's',
      defaultValue: './stories/*.stories.{js,mdx}',
      description: 'List of story files e.g. --stories stories/*.stories.{js,mdx}',
    },
    {
      name: 'manager-path',
      description: 'Import path of a prebuilt manager file',
    },
    {
      name: 'preview-path',
      description: 'Import path of a prebuilt preview file',
    },
  ];

  const dashedArgs = commandLineArgs(optionDefinitions);
  const args = dashToCamelArgs(dashToCamelArgs);
  let mainConfig = readMainJs(args.configDir);

  if (!mainConfig) {
    /**
     * TODO: Read backwards compatible build-storybook.config.js file
     */
    if ('config' in dashedArgs) {
      // read user config
      const configPath = path.resolve(process.cwd(), args.configDir, dashedArgs.config);
      if (!fs.existsSync(configPath) || !fs.statSync(configPath).isFile()) {
        throw new Error(`Did not find any config file at ${configPath}`);
      }

      mainConfig = require(configPath);
    } else {
      // read default config
      const configPath = path.resolve(process.cwd(), args.configDir, 'build-storybook.config.js');

      if (fs.existsSync(configPath)) {
        mainConfig = require(configPath);
      }
    }
  }

  return deepmerge(mainConfig, args);
};
