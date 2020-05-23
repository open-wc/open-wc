/** @typedef {import('./types').HtmlFile} HtmlFile */

const { findJsScripts, toFilePath } = require('@open-wc/building-utils');
const path = require('path');
const { parse, serialize } = require('parse5');
const {
  getAttribute,
  getTextContent,
  remove,
} = require('@open-wc/building-utils/dom5-fork/index.js');

/**
 * @param {HtmlFile} inputHtmlData
 * @param {string} inputHtmlName
 * @param {string} [projectRootDir]
 */
function extractModules(inputHtmlData, inputHtmlName, projectRootDir = process.cwd()) {
  const { html, rootDir: htmlRootDir } = inputHtmlData;
  const documentAst = parse(html);
  const scriptNodes = findJsScripts(documentAst, { jsScripts: true, inlineJsScripts: true });

  /** @type {string[]} */
  const moduleImports = [];
  /** @type {Map<string, string>} */
  const inlineModules = new Map();

  scriptNodes.forEach((scriptNode, i) => {
    const src = getAttribute(scriptNode, 'src');

    if (!src) {
      // turn inline module (<script type="module"> ...code ... </script>)
      const suffix = path.posix.basename(inputHtmlName).split('.')[0];
      const importPath = path.posix.join(htmlRootDir, `inline-module-${suffix}-${i}.js`);
      inlineModules.set(importPath, getTextContent(scriptNode));
    } else {
      // external script <script type="module" src="./foo.js"></script>
      const importPath = path.join(
        src.startsWith('/') ? projectRootDir : htmlRootDir,
        toFilePath(src),
      );
      moduleImports.push(importPath);
    }

    remove(scriptNode);
  });

  const updatedHtmlString = serialize(documentAst);

  return { moduleImports, inlineModules, htmlWithoutModules: updatedHtmlString };
}

module.exports = { extractModules };
