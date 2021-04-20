/** @typedef {import('@web/dev-server-core').Plugin} DevServerPlugin */
/** @typedef {import('./utils').Matcher} Matcher */

/**
 * @typedef {object} BaseClass
 * @property {string} name
 * @property {string} [import]
 */

/**
 * @typedef {object} Decorator
 * @property {string} name
 * @property {string} [import]
 */

/**
 * @typedef {object} FunctionOption
 * @property {string} name
 * @property {string} [import]
 */

/**
 * @typedef {object} Preset
 * @property {BaseClass[]} baseClasses
 * @property {Decorator[]} decorators
 * @property {string} patch
 */

/**
 * @typedef {object} WcHmrPluginConfig
 * @property {string[]} [include]
 * @property {string[]} [exclude]
 * @property {Preset[]} [presets]
 * @property {BaseClass[]} [baseClasses]
 * @property {Decorator[]} [decorators]
 * @property {FunctionOption[]} [functions]
 * @property {string[]} [patches]
 */

const { getRequestFilePath, PluginSyntaxError } = require('@web/dev-server-core');
const { hmrPlugin: createBaseHmrPlugin } = require('@web/dev-server-hmr');
const fs = require('fs');
const path = require('path');

const { WC_HMR_MODULE_PREFIX, WC_HMR_MODULE_RUNTIME, WC_HMR_MODULE_PATCH } = require('./constants');
const { parseConfig, createMatchers, createError } = require('./utils');
const { babelTransform } = require('./babel/babelTransform');

const wcHmrRuntime = fs.readFileSync(path.resolve(__dirname, 'wcHmrRuntime.js'), 'utf-8');

/**
 * @param {WcHmrPluginConfig} pluginConfig
 * @returns {DevServerPlugin}
 */
function hmrPlugin(pluginConfig) {
  const baseHmrPlugin = createBaseHmrPlugin();
  const parsedPluginConfig = parseConfig(pluginConfig);

  /** @type {string} */
  let rootDir;
  /** @type {Matcher} */
  let matchInclude = () => true;
  /** @type {Matcher} */
  let matchExclude = () => false;

  return {
    name: 'wc-hmr',
    injectWebSocket: true,

    resolveImport(...args) {
      const { source } = args[0];
      if (source.startsWith(WC_HMR_MODULE_PREFIX)) {
        return source;
      }

      return baseHmrPlugin.resolveImport && baseHmrPlugin.resolveImport(...args);
    },

    serve(...args) {
      const context = args[0];
      if (context.path === WC_HMR_MODULE_RUNTIME) {
        return wcHmrRuntime;
      }

      if (context.path === WC_HMR_MODULE_PATCH) {
        return (pluginConfig.patches && pluginConfig.patches.join('\n')) || '';
      }

      return baseHmrPlugin.serve && baseHmrPlugin.serve(...args);
    },

    serverStart(...args) {
      if (!args[0].config.plugins || args[0].config.plugins.find(pl => pl.name === 'hmr')) {
        throw createError(
          `Cannot include both @web/dev-server-hmr and @open-wc/dev-server-hmr plugins.`,
        );
      }

      rootDir = args[0].config.rootDir;
      if (parsedPluginConfig.include) {
        matchInclude = createMatchers(rootDir, parsedPluginConfig.include);
      }

      if (parsedPluginConfig.exclude) {
        matchExclude = createMatchers(rootDir, parsedPluginConfig.exclude);
      }

      return baseHmrPlugin.serverStart && baseHmrPlugin.serverStart(...args);
    },

    async transform(...args) {
      const context = args[0];
      if (!context.response.is('js') || context.path.startsWith('/__web-dev-server__')) {
        return;
      }

      const filePath = getRequestFilePath(context, rootDir);
      if (
        matchInclude(filePath) &&
        !matchExclude(filePath) &&
        !filePath.startsWith('__web-dev-server__') &&
        typeof context.body === 'string'
      ) {
        try {
          context.body = await babelTransform(context.body, filePath, {
            baseClasses: parsedPluginConfig.baseClasses,
            decorators: parsedPluginConfig.decorators,
            functions: parsedPluginConfig.functions,
            patches: parsedPluginConfig.patches,
            rootDir,
          });
        } catch (error) {
          if (error.name === 'SyntaxError') {
            // forward babel error to dev server
            const strippedMsg = error.message.replace(new RegExp(`${filePath} ?:? ?`, 'g'), '');
            throw new PluginSyntaxError(strippedMsg, filePath, error.code, error.loc, error.pos);
          }
          throw error;
        }
      }

      return baseHmrPlugin.transform && baseHmrPlugin.transform(...args);
    },

    // forward all other plugin hooks
    serverStop(...args) {
      return baseHmrPlugin.serverStop && baseHmrPlugin.serverStop(...args);
    },
    transformCacheKey(...args) {
      return baseHmrPlugin.transformCacheKey && baseHmrPlugin.transformCacheKey(...args);
    },
    transformImport(...args) {
      return baseHmrPlugin.transformImport && baseHmrPlugin.transformImport(...args);
    },
    resolveMimeType(...args) {
      return baseHmrPlugin.resolveMimeType && baseHmrPlugin.resolveMimeType(...args);
    },
  };
}

module.exports = { hmrPlugin };
