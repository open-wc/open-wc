const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const {
  readCommandLineArgs: esDevServerCommandLineArgs,
  commandLineOptions: esDevServerCliOptions,
} = require('es-dev-server');

module.exports = function readCommandLineArgs() {
  const cliOptions = [
    {
      name: 'config-dir',
      alias: 'd',
      type: String,
      defaultValue: './.storybook',
      description: 'Location of storybook configuration',
    },
    {
      name: 'stories',
      alias: 's',
      defaultValue: './stories/*.stories.{js,mdx}',
      description: 'List of story files e.g. --stories stories/*.stories.\\{js,mdx\\}',
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
    { name: 'help', type: Boolean, description: 'See all options' },
  ];

  const storybookArgs = commandLineArgs(cliOptions, { partial: true });

  if ('help' in storybookArgs) {
    /* eslint-disable-next-line no-console */
    console.log(
      commandLineUsage([
        {
          header: 'storybook-start',
          content: `
          Storybook start command. Wraps the es-dev-server, adding storybook specific functionality. All regular es-dev-server commands are available.

          Usage: \`storybook-start [options...]\`
        `.trim(),
        },
        {
          header: 'storybook options',
          optionList: cliOptions,
        },
        {
          header: 'es-dev-server options',
          content: '',
          optionList: esDevServerCliOptions,
        },
      ]),
    );
    process.exit();
  }

  const esDevServerConfig = esDevServerCommandLineArgs(storybookArgs._unknown || [], {
    defaultConfigDir: storybookArgs['config-dir'],
    defaultConfigName: 'start-storybook.config.js',
  });

  return {
    configDir: storybookArgs['config-dir'],
    stories: storybookArgs.stories,
    managerPath: storybookArgs['manager-path'],
    previewPath: storybookArgs['preview-path'],
    // some args may be overwritten, as es-dev-server reads start-storybook.config.js
    ...esDevServerConfig,
  };
};
