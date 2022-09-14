const { mdjsToMd } = require('./mdjsToMd.js');
const { renameDefaultExport } = require('./renameDefaultExport.js');
const { createStoriesCode } = require('./createStoriesCode.js');
const { mdToJsx } = require('./mdToJsx.js');
const { jsxToJs } = require('./jsxToJs.js');

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
