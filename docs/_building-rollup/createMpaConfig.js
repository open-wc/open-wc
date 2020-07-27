/* eslint-disable */
/** @typedef {import('./types').SpaOptions} SpaOptions */

const merge = require('deepmerge');
const { createSpaConfig } = require('@open-wc/building-rollup');

/**
 * @param {SpaOptions} options
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
