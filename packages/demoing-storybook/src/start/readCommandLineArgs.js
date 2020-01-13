const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const path = require('path');
const {
  readCommandLineArgs: esDevServerCommandLineArgs,
  commandLineOptions: esDevServerCliOptions,
} = require('es-dev-server');
const readMainJs = require('../shared/readMainJs');

// default values for non-cli only options
const storybookDefaults = {
  managerPath: '@open-wc/storybook-prebuilt/dist/manager.js',
  previewPath: '@open-wc/storybook-prebuilt/dist/preview.js',
};

/**
 * @param {object} args
 */
function dashToCamelArgs(args) {
  const config = {};
  if ('config-dir' in args) {
    config.configDir = args['config-dir'];
  }
  if ('stories' in args) {
    config.stories = args.stories;
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
  const cliOptions = [
    {
      name: 'config-dir',
      alias: 'c',
      type: String,
      // default value for config dir should be here, since it's a CLI only option
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
      description: 'Import path of a prebuilt manager file',
    },
    {
      name: 'preview-path',
      description: 'Import path of a prebuilt preview file',
    },
    { name: 'help', type: Boolean, description: 'See all options' },
  ];

  let storybookArgs = commandLineArgs(cliOptions, { partial: true });

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

  const configDir = storybookArgs['config-dir'];
  const result = readMainJs(configDir);
  const { mainFilePath } = result;
  let { mainJs } = result;

  // TODO: read start-storybook.config.js if the user didn't provide a main.js file. This keeps us backwards compatible with the situation
  // before we introduced main.js. This should be removed at the next breaking change.
  const defaultConfigOptions = mainJs
    ? undefined
    : {
        defaultConfigDir: storybookArgs['config-dir'],
        defaultConfigName: 'start-storybook.config.js',
      };

  let esDevServerConfig = esDevServerCommandLineArgs(
    storybookArgs._unknown || [],
    defaultConfigOptions,
  );

  // TODO: before we introduced main.js, we had a start-storybook.config.js which contains storybook and es-dev-server parameters
  // to remain backwards compatible, we spread it's properties into the storybook args. This should be removed at the next breaking change.
  if (!mainJs) {
    mainJs = esDevServerConfig;
  }

  // merge es-dev-server args by priority: config file, then CLI parameters
  if (mainJs && mainJs.esDevServer) {
    esDevServerConfig = {
      ...mainJs.esDevServer,
      ...esDevServerConfig,
    };
  }

  const mainDir = path.dirname(mainFilePath);
  let stories;
  let resolvedStories;
  if (mainJs.stories && !esDevServerConfig.stories) {
    stories = typeof mainJs.stories === 'string' ? [mainJs.stories] : mainJs.stories;
    resolvedStories = stories.map(pattern => path.resolve(mainDir, pattern));
  } else {
    // TODO: before we introduced main.js, stories was usually configured from the command line. We still support this to remain
    // backwards compatible. This should be removed at the next breaking change.
    stories = [mainJs.stories || storybookArgs.stories];
    // no need to pre-resolve the backwards compatible one
    resolvedStories = stories;
  }

  // merge storybook args by priority: defaults, then file config, then CLI parameters
  storybookArgs = {
    ...storybookDefaults,
    ...(mainJs || {}),
    ...dashToCamelArgs(storybookArgs),
    // we already mapped the correct stories above, so always set that value
    stories,
    resolvedStories,
  };

  return {
    ...storybookArgs,
    esDevServerConfig,
  };
};
