/* eslint-disable */
/** @typedef {import('./types').MpaOptions} MpaOptions */

const merge = require('deepmerge');
const { createSpaConfig } = require('./createSpaConfig.js');

/**
 * @param {MpaOptions} options
 */
function createMpaConfig(options) {
  const userOptions = merge(
    {
      html: { flatten: false },
    },
    options,
  );
  return createSpaConfig(userOptions);
}

module.exports = { createMpaConfig };
