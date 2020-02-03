/** @typedef {import('./types').InputHtmlData} InputHtmlData */

const { findJsScripts } = require('@open-wc/building-utils');
const path = require('path');
const { parse, serialize } = require('parse5');
const {
  getAttribute,
  getTextContent,
  remove,
} = require('@open-wc/building-utils/dom5-fork/index.js');

/**
 * @param {InputHtmlData} inputHtmlData
 * @param {string} [projectRootDir]
 */
function extractModules(inputHtmlData, projectRootDir = process.cwd()) {
  const { inputHtml, name, rootDir: htmlRootDir } = inputHtmlData;
  const documentAst = parse(inputHtml);
  const scriptNodes = findJsScripts(documentAst, { jsScripts: true, inlineJsScripts: true });

  /** @type {string[]} */
  const moduleImports = [];
  /** @type {Map<string, string>} */
  const inlineModules = new Map();
  scriptNodes.forEach((scriptNode, i) => {
    const src = getAttribute(scriptNode, 'src');

    if (!src) {
      inlineModules.set(`inline-module-${name.split('.')[0]}-${i}`, getTextContent(scriptNode));
    } else {
      const importPath = path.join(src.startsWith('/') ? projectRootDir : htmlRootDir, src);
      moduleImports.push(importPath);
    }

    remove(scriptNode);
  });

  const updatedHtmlString = serialize(documentAst);

  return { moduleImports, inlineModules, htmlWithoutModules: updatedHtmlString };
}

module.exports = { extractModules };
