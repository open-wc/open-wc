/** @typedef {import('./src/types').PolyfillsLoaderConfig} PolyfillsLoaderConfig */
/** @typedef {import('./src/types').PolyfillsConfig} PolyfillsConfig */
/** @typedef {import('./src/types').PolyfillConfig} PolyfillConfig */
/** @typedef {import('./src/types').ModernEntrypoint} ModernEntrypoint */
/** @typedef {import('./src/types').LegacyEntrypoint} LegacyEntrypoint */
/** @typedef {import('./src/types').FileType} FileType */
/** @typedef {import('./src/types').File} File */
/** @typedef {import('./src/types').GeneratedFile} GeneratedFile */
/** @typedef {import('./src/types').PolyfillFile} PolyfillFile */
/** @typedef {import('./src/types').PolyfillsLoader} PolyfillsLoader */

const { injectPolyfillsLoader } = require('./src/inject-polyfills-loader');
const { createPolyfillsLoader } = require('./src/create-polyfills-loader');
const {
  noModuleSupportTest,
  fileTypes,
  createContentHash,
  cleanImportPath,
  getScriptFileType,
  hasFileOfType,
} = require('./src/utils');

module.exports = {
  injectPolyfillsLoader,
  createPolyfillsLoader,

  noModuleSupportTest,
  fileTypes,
  createContentHash,
  cleanImportPath,
  getScriptFileType,
  hasFileOfType,
};
