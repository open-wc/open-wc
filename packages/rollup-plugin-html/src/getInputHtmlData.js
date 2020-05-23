/** @typedef {import('rollup').InputOptions} InputOptions */
/** @typedef {import('./types').PluginOptions} PluginOptions */
/** @typedef {import('./types').HtmlFile} HtmlFile */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const { createError } = require('./utils');

/**
 * Lists all files using the specified glob, starting from the given root directory.
 *
 * Will return all matching file paths fully resolved.
 * @param {string} fromGlob
 * @param {string} rootDir
 * @return {string[]}
 */
function listFiles(fromGlob, rootDir) {
  const files = glob.sync(fromGlob, { cwd: rootDir, absolute: true });
  return (
    files
      // filter out directories
      .filter(filePath => !fs.lstatSync(filePath).isDirectory())
  );
}

/**
 * @param {string} globs
 * @param {string} rootDir
 */
function globsToFiles(globs, rootDir) {
  const patterns = typeof globs === 'string' ? [globs] : globs;

  /** @type {string[]} */
  let files = [];
  for (const pattern of patterns) {
    files = [...files, ...listFiles(pattern, rootDir)];
  }
  return files;
}

/**
 * @param {string} filePath
 * @param {string} rootDir
 * @param {boolean} flatten
 */
function getName(filePath, rootDir, flatten = true) {
  if (flatten) {
    return path.basename(filePath);
  }
  return path.relative(rootDir, filePath);
}

/**
 * @param {PluginOptions} pluginOptions
 * @param {string} [rollupInput]
 * @returns {HtmlFile[]}
 */
function getInputHtmlData(pluginOptions, rollupInput) {
  // backward compatibility
  if (pluginOptions.inputHtml) {
    // eslint-disable-next-line no-param-reassign
    pluginOptions.html = pluginOptions.inputHtml;
  }
  if (pluginOptions.inputPath) {
    // eslint-disable-next-line no-param-reassign
    pluginOptions.files = pluginOptions.inputPath;
  }

  const { html, rootDir = process.cwd(), name, files, flatten } = pluginOptions;

  if (typeof html === 'string') {
    return [
      {
        name,
        rootDir,
        html,
      },
    ];
  }
  if (Array.isArray(html)) {
    return html.map(htmlFile => ({ rootDir, ...htmlFile }));
  }

  if (!files && !rollupInput) {
    throw createError('Internal plugin error, missing input while getInputHtmlData is called.');
  }

  const rawPath = /** @type {string} */ (files || rollupInput);
  const filePaths = globsToFiles(rawPath, rootDir);

  if (filePaths.length === 0) {
    throw createError(`Could not find a HTML input file: ${rawPath}`);
  }
  const result = [];
  for (const filePath of filePaths) {
    result.push({
      name: name || getName(filePath, rootDir, flatten),
      rootDir: path.dirname(filePath),
      html: fs.readFileSync(filePath, 'utf-8'),
    });
  }
  return result;
}

module.exports = { getInputHtmlData };
