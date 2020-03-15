/** @typedef {import('rollup').InputOptions} InputOptions */
/** @typedef {import('./types').PluginOptions} PluginOptions */

const PLUGIN = '[rollup-plugin-polyfills-loader]';

/**
 * @param {string} msg
 */
function createError(msg) {
  return new Error(`${PLUGIN} ${msg}`);
}

module.exports = {
  createError,
};
