/* eslint-disable import/no-dynamic-require, global-require */
const commandLineArgs = require('command-line-args');
const path = require('path');
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
      name: 'disable-recommended-addons',
      type: Boolean,
      defaultValue:
        typeof mainJs.disableRecommendedAddons === 'boolean'
          ? mainJs.disableRecommendedAddons
          : false,
    },
    {
      name: 'experimental-md-docs',
      type: Boolean,
    },
  ];

  const args = commandLineArgs(optionDefinitions, { partial: true });

  const addons = mainJs.addons || [];
  if (!args['disable-recommended-addons']) {
    addons.push(
      'storybook-prebuilt/addon-actions/register.js',
      'storybook-prebuilt/addon-knobs/register.js',
      'storybook-prebuilt/addon-a11y/register.js',
      'storybook-prebuilt/addon-docs/register.js',
      'storybook-prebuilt/addon-backgrounds/register.js',
      'storybook-prebuilt/addon-links/register.js',
      'storybook-prebuilt/addon-viewport/register.js',
    );
  }

  return {
    configDir: args['config-dir'],
    outputDir: args['output-dir'],
    stories: args.stories,
    rollup: mainJs.rollup,
    addons: mainJs.addons,
    experimentalMdDocs: args['experimental-md-docs'],
  };
};
