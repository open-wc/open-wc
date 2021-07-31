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
      html: { flattenOutput: false },
      workbox: {
        navigateFallback: '/404.html',
      },
    },
    options,
  );
  return createSpaConfig(userOptions);
}

module.exports = { createMpaConfig };
