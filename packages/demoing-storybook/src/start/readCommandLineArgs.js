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

  let mainJs = { esDevServer: {} };
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
    defaultConfigName: 'start-storybook.config.js',
  });

  return {
    configDir: storybookArgs['config-dir'],
    stories: storybookArgs.stories,
    managerPath: storybookArgs['manager-path'],
    previewPath: storybookArgs['preview-path'],
    addons: mainJs.addons,
    // some args may be overwritten, as es-dev-server reads start-storybook.config.js
    ...esDevServerConfig,
    ...mainJs.esDevServer,
  };
};
