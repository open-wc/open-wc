const fs = require('fs');
const path = require('path');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const {
  readCommandLineArgs: esDevServerCommandLineArgs,
  commandLineOptions: esDevServerCliOptions,
} = require('es-dev-server');

module.exports = function readCommandLineArgs() {
  const tmpConfig = commandLineArgs(
    [
      {
        name: 'config-dir',
        alias: 'c',
        type: String,
        defaultValue: './.storybook',
      },
    ],
    { partial: true },
  );
  const mainFilePath = path.join(process.cwd(), tmpConfig['config-dir'], 'main.js');
  const mainDir = path.dirname(mainFilePath);

  let mainJs = { esDevServer: {} };
  if (fs.existsSync(mainFilePath)) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    mainJs = require(mainFilePath);
    if (mainJs.stories) {
      mainJs.stories = typeof mainJs.stories === 'string' ? [mainJs.stories] : mainJs.stories;
      mainJs.stories = mainJs.stories.map(entry => path.join(mainDir, entry));
    }
    mainJs.esDevServer = mainJs.esDevServer || {};
  }

  const cliOptions = [
    {
      name: 'config-dir',
      alias: 'c',
      type: String,
      defaultValue: './.storybook',
      description: 'Location of storybook configuration',
    },
    {
      name: 'stories',
      defaultValue: mainJs.stories || './stories/*.stories.{js,mdx}',
      description: 'List of story files e.g. --stories stories/*.stories.\\{js,mdx\\}',
    },
    { name: 'help', type: Boolean, description: 'See all options' },
  ];

  const storybookArgs = commandLineArgs(cliOptions, { partial: true });
  storybookArgs.stories =
    typeof storybookArgs.stories === 'string' ? [storybookArgs.stories] : storybookArgs.stories;

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
  });

  return {
    configDir: storybookArgs['config-dir'],
    stories: storybookArgs.stories,
    addons: mainJs.addons || [],
    setupMdjsPlugins: mainJs.setupMdjsPlugins,

    // TODO: we should separate es dev server config and storybook config
    // command line args read from regular es-dev-server
    ...esDevServerConfig,
    // args set in main js config
    ...mainJs.esDevServer,
  };
};
