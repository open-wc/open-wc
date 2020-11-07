const { mdjsToMd } = require('./mdjsToMd');
const { renameDefaultExport } = require('./renameDefaultExport');
const { createStoriesCode } = require('./createStoriesCode');
const { mdToJsx } = require('./mdToJsx');
const { jsxToJs } = require('./jsxToJs');

/**
 * @param {string} markdown
 * @param {string} filePath
 * @param {string} projectType
 * @param {object} options
 * @returns {Promise<string>}
 */
async function mdjsToCsf(markdown, filePath, projectType, mdjsOptions = {}) {
  const markdownResult = await mdjsToMd(markdown, { ...mdjsOptions, filePath });

  const jsCode = renameDefaultExport(markdownResult.jsCode, filePath);
  const storiesCode = createStoriesCode(markdownResult.stories);
  const docsJsx = await mdToJsx(markdownResult.html, filePath, projectType, markdownResult.stories);
  const docs = await jsxToJs(docsJsx, filePath);

  return `${jsCode}\n${storiesCode}\n${docs}`;
}

module.exports = {
  mdjsToCsf,
};
