/** @typedef {import('rollup').InputOptions} InputOptions */
/** @typedef {import('./types').PluginOptions} PluginOptions */
/** @typedef {import('./types').InputHtmlData} InputHtmlData */

const fs = require('fs-extra');
const path = require('path');
const { createError } = require('./utils');

/**
 * @param {PluginOptions} pluginOptions
 * @param {string} [rollupInput]
 * @param {string} [rootDir]
 * @returns {InputHtmlData}
 */
function getInputHtmlData(pluginOptions, rollupInput, rootDir = process.cwd()) {
  if (pluginOptions.inputHtml) {
    return {
      name: pluginOptions.name,
      rootDir,
      inputHtml: pluginOptions.inputHtml,
    };
  }

  if (!pluginOptions.inputPath && !rollupInput) {
    throw createError('Internal plugin error, missing input while getInputHtmlData is called.');
  }

  const inputPath = /** @type {string} */ (pluginOptions.inputPath || rollupInput);
  const htmlPath = path.resolve(rootDir, inputPath);
  if (!fs.existsSync) {
    throw createError(`Could not find HTML input file at: ${htmlPath}`);
  }
  const htmlDir = path.dirname(htmlPath);
  const inputHtml = fs.readFileSync(htmlPath, 'utf-8');
  const name = pluginOptions.name || path.basename(inputPath);
  return { name, rootDir: htmlDir, inputHtml };
}

module.exports = { getInputHtmlData };
