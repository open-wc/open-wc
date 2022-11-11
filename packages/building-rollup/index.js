/**
 * @typedef {import('./src/types').BasicOptions} BasicOptions
 * @typedef {import('./src/types').SpaOptions} SpaOptions
 */

const { createBasicConfig } = require('./src/createBasicConfig.js');
const { createSpaConfig } = require('./src/createSpaConfig.js');
const { createMpaConfig } = require('./src/createMpaConfig.js');

module.exports = { createBasicConfig, createSpaConfig, createMpaConfig };
