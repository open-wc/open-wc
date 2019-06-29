const { parse } = require('parse5');
const { queryAll, predicates, getAttribute, remove } = require('../dom5-fork');

/**
 * @typedef {object} ExtractResult
 * @property {import('parse5').ASTNode} indexHTML the index file, with resources removed
 * @property {string[]} jsModules paths to js modules that were found
 * @property {string[]} inlineImportMaps content of inline import maps that were found
 * @property {string[]} importMapPaths paths to import map json files that were found
 */

/**
 * Extracts resources from an html file. Resources are any files referenced by the file
 * using script or link elements.
 *
 * TODO: Currently only supports js modules, need to add more later.
 *
 * @param {string} htmlString the html file as string
 * @returns {ExtractResult}
 */
function extractResources(htmlString) {
  const indexHTML = parse(htmlString);

  const scripts = queryAll(indexHTML, predicates.hasTagName('script'));
  const moduleScripts = scripts.filter(script => getAttribute(script, 'type') === 'module');
  const importMapScripts = scripts.filter(script => getAttribute(script, 'type') === 'importmap');

  const jsModules = [];
  const inlineImportMaps = [];
  const importMapPaths = [];

  moduleScripts.forEach(moduleScript => {
    const src = getAttribute(moduleScript, 'src');
    if (src) {
      jsModules.push(src);
      remove(moduleScript);
    }
  });

  importMapScripts.forEach(importMapScript => {
    const src = getAttribute(importMapScript, 'src');
    if (!src) {
      inlineImportMaps.push(importMapScript.childNodes[0].value);
    } else {
      importMapPaths.push(src);
    }
    remove(importMapScript);
  });

  // TODO: Also extract other kinds of resources
  return { indexHTML, jsModules, inlineImportMaps, importMapPaths };
}

module.exports.extractResources = extractResources;
