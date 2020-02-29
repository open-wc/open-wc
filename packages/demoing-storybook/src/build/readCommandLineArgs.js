/* eslint-disable import/no-dynamic-require, global-require */
const commandLineArgs = require('command-line-args');
const path = require('path');
const deepmerge = require('deepmerge');
const fs = require('fs');

module.exports = function readCommandLineArgs() {
  const tmpConfig = commandLineArgs(
    {
      name: 'config-dir',
      alias: 'c',
      type: String,
      defaultValue: './.storybook',
    },
    { partial: true },
  );
  const mainFilePath = path.join(process.cwd(), tmpConfig['config-dir'], 'main.js');
  const mainDir = path.dirname(mainFilePath);

  let mainJs = {};
  if (fs.existsSync(mainFilePath)) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    mainJs = require(mainFilePath);
    if (mainJs.stories) {
      mainJs.stories = typeof mainJs.stories === 'string' ? [mainJs.stories] : mainJs.stories;
      mainJs.stories = mainJs.stories.map(entry => path.join(mainDir, entry));
    }
    // fix relative paths if they work - otherwise let resolve handle it afterwards
    if (mainJs.managerPath && fs.existsSync(path.join(mainDir, mainJs.managerPath))) {
      mainJs.managerPath = path.join(mainDir, mainJs.managerPath);
    }
    if (mainJs.previewPath && fs.existsSync(path.join(mainDir, mainJs.previewPath))) {
      mainJs.previewPath = path.join(mainDir, mainJs.previewPath);
    }
    // output-dir can be none existing
    if (mainJs.outputDir) {
      mainJs.outputDir = path.relative(process.cwd(), path.join(mainDir, mainJs.outputDir));
    }
  }

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
      defaultValue: mainJs.outputDir || 'storybook-static',
      description: 'Rollup build output directory',
    },
    {
      name: 'stories',
      defaultValue: mainJs.stories || './stories/*.stories.{js,mdx}',
      description: 'List of story files e.g. --stories stories/*.stories.{js,mdx}',
    },
    {
      name: 'manager-path',
      defaultValue: mainJs.managerPath || '@open-wc/demoing-storybook/manager.js',
      description: 'Import path of a prebuilt manager file',
    },
    {
      name: 'preview-path',
      defaultValue: mainJs.previewPath || 'storybook-prebuilt/web-components.js',
      description: 'Import path of a prebuilt preview file',
    },
  ];

  const args = commandLineArgs(optionDefinitions, { partial: true });

  let options = {
    configDir: args['config-dir'],
    outputDir: args['output-dir'],
    stories: args.stories,
    rollup: mainJs.rollup,
    addons: mainJs.addons,
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
