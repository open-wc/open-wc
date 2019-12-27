const commandLineArgs = require('command-line-args');

module.exports = function readCommandLineArgs() {
  const optionDefinitions = [
    {
      name: 'config-dir',
      alias: 'd',
      type: String,
      defaultValue: './.storybook',
      description: 'Location of storybook configuration',
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
  ];
  const storybookServerConfig = commandLineArgs(optionDefinitions);
  console.log('storybookServerConfig', storybookServerConfig);
  return storybookServerConfig;
};
