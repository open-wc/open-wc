/**
 * @typedef {import('./src/types').BasicOptions} BasicOptions
 * @typedef {import('./src/types').SpaOptions} SpaOptions
 */

const { createBasicConfig } = require('./src/createBasicConfig');
const { createSpaConfig } = require('./src/createSpaConfig');

module.exports = { createBasicConfig, createSpaConfig };
