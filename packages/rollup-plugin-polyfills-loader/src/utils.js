/** @typedef {import('rollup').InputOptions} InputOptions */
/** @typedef {import('./types').PluginOptions} PluginOptions */
/** @typedef {import('polyfills-loader').PolyfillsLoaderConfig} PolyfillsLoaderConfig */

const { fileTypes } = require('polyfills-loader');

const PLUGIN = '[rollup-plugin-polyfills-loader]';

/**
 * @param {string} msg
 */
function createError(msg) {
  return new Error(`${PLUGIN} ${msg}`);
}

/**
 * @param {PolyfillsLoaderConfig} config
 */
function shouldInjectLoader(config) {
  if (config.modern.files.some(f => f.type !== fileTypes.MODULE)) {
    return true;
  }

  if (config.legacy && config.legacy.length > 0) {
    return true;
  }

  if (config.polyfills && config.polyfills.custom && config.polyfills.custom.length > 0) {
    return true;
  }

  return !!(
    config.polyfills &&
    Object.entries(config.polyfills).some(([k, v]) => !['hash', 'custom'].includes(k) && v === true)
  );
}

module.exports = {
  createError,
  shouldInjectLoader,
};
