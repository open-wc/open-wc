/* eslint-disable import/no-dynamic-require, global-require */
const commandLineArgs = require('command-line-args');
const path = require('path');
const deepmerge = require('deepmerge');
const fs = require('fs');

module.exports = function readCommandLineArgs() {
  const optionDefinitions = [
    {
      name: 'config-dir',
      alias: 'd',
      type: String,
      defaultValue: './.storybook',
      description: 'Location of storybook configuration directory',
    },
    {
      name: 'config',
      alias: 'c',
      type: String,
      description: 'Name of the storybook build configuration file',
    },
    {
      name: 'output-dir',
      alias: 'o',
      type: String,
      defaultValue: 'storybook-static',
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
      defaultValue: '@open-wc/storybook-prebuilt/dist/manager.js',
      description: 'Import path of a prebuilt manager file',
    },
    {
      name: 'preview-path',
      defaultValue: '@open-wc/storybook-prebuilt/dist/preview.js',
      description: 'Import path of a prebuilt preview file',
    },
  ];

  const args = commandLineArgs(optionDefinitions);
  let options = {
    configDir: args['config-dir'],
    outputDir: args['output-dir'],
    stories: args.stories,
    managerPath: args['manager-path'],
    previewPath: args['preview-path'],
  };

  if ('config' in args) {
    // read user config
    const configPath = path.resolve(process.cwd(), options.configDir, args.config);
    if (!fs.existsSync(configPath) || !fs.statSync(configPath).isFile()) {
      throw new Error(`Did not find any config file at ${configPath}`);
    }

    options = deepmerge(options, require(configPath));
  } else {
    // read default config
    const configPath = path.resolve(process.cwd(), options.configDir, 'build-storybook.config.js');

    if (fs.existsSync(configPath)) {
      options = deepmerge(options, require(configPath));
    }
  }

  return options;
};
