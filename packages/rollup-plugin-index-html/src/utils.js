const PLUGIN_NAME = 'rollup-plugin-index-html';

/** @param {string} msg */
function createError(msg) {
  return new Error(`[${PLUGIN_NAME}]: ${msg}`);
}

module.exports = {
  PLUGIN_NAME,
  createError,
};
