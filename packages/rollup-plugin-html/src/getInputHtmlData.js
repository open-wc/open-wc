/** @typedef {import('./types').PluginOptions} PluginOptions */
/** @typedef {import('./types').InputHtmlData} InputHtmlData */

const fs = require('fs-extra');
const path = require('path');
const { createError } = require('./utils');

/**
 * @param {PluginOptions} pluginOptions
 * @param {string} rootDir
 * @returns {InputHtmlData}
 */
function getInputHtmlData(pluginOptions, rootDir = process.cwd()) {
  if (pluginOptions.inputHtml) {
    if (!pluginOptions.name) {
      throw createError('Must set a name option when providing inputHtml directory.');
    }

    return {
      name: pluginOptions.name,
      rootDir,
      inputHtml: pluginOptions.inputHtml,
    };
  }

  if (!pluginOptions.inputPath) {
    throw createError('Input must have either a path or content.');
  }

  const htmlPath = path.resolve(rootDir, pluginOptions.inputPath);
  if (!fs.existsSync) {
    throw createError(`Could not find HTML input file at: ${htmlPath}`);
  }
  const htmlDir = path.dirname(htmlPath);
  const inputHtml = fs.readFileSync(htmlPath, 'utf-8');
  const name = pluginOptions.name || path.basename(pluginOptions.inputPath);
  return { name, rootDir: htmlDir, inputHtml };
}

module.exports = { getInputHtmlData };
