const { transformAsync } = require('@babel/core');

const babelPluginWcHmr = require('./babelPluginWcHmr');
const { createError } = require('../utils');

/** @typedef {import('./babelPluginWcHmr').BabelPluginWcHmrOptions} BabelPluginWcHmrOptions */

/**
 * @param {string} code
 * @param {string} filename
 * @param {BabelPluginWcHmrOptions} options
 * @returns {Promise<string>}
 */
async function babelTransform(code, filename, options) {
  const largeFile = code.length > 100000;
  const result = await transformAsync(code, {
    caller: {
      name: '@open-wc/dev-server-hmr',
      supportsStaticESM: true,
    },
    plugins: [
      [babelPluginWcHmr, options],
      require.resolve('@babel/plugin-syntax-class-properties'),
      require.resolve('@babel/plugin-syntax-import-assertions'),
      require.resolve('@babel/plugin-syntax-top-level-await'),
    ],
    filename,
    babelrc: false,
    configFile: false,
    compact: largeFile,
    sourceType: 'module',
  });

  if (!result || !result.code) {
    throw createError(`Failed to babel transform ${filename}`);
  }
  return result.code;
}

module.exports = { babelTransform };
