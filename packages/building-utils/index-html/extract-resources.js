const { parse } = require('parse5');
const { isUri } = require('valid-url');
const { queryAll, predicates, getAttribute, remove } = require('../dom5-fork');

/**
 * @typedef {object} ExtractResult
 * @property {import('parse5').Document} indexHTML the index file, with resources removed
 * @property {string[]} inlineModules inline module scripts
 * @property {string[]} jsModules paths to js modules that were found
 * @property {string[]} inlineImportMaps content of inline import maps that were found
 * @property {string[]} importMapPaths paths to import map json files that were found
 */

/**
 * Extracts resources from an html file. Resources are any files referenced by the file
 * using script or link elements.
 *
 * @param {string} htmlString the html file as string
 * @param {{ removeModules?: boolean, removeImportMaps?: boolean }} options
 * @returns {ExtractResult}
 */
function extractResources(htmlString, options = {}) {
  const { removeModules = true, removeImportMaps = true } = options;
  const indexHTML = parse(htmlString);

  const scripts = queryAll(indexHTML, predicates.hasTagName('script'));
  const moduleScripts = scripts.filter(script => getAttribute(script, 'type') === 'module');
  const importMapScripts = scripts.filter(script => getAttribute(script, 'type') === 'importmap');

  const inlineModules = [];
  const jsModules = [];
  const inlineImportMaps = [];
  const importMapPaths = [];

  moduleScripts.forEach(moduleScript => {
    const src = getAttribute(moduleScript, 'src');
    // don't touch scripts which reference external resources
    if (isUri(src)) {
      return;
    }

    if (src) {
      jsModules.push(src);
    } else if (moduleScript.childNodes && moduleScript.childNodes[0]) {
      inlineModules.push(moduleScript.childNodes[0].value);
    }

    if (removeModules) {
      remove(moduleScript);
    }
  });

  importMapScripts.forEach(importMapScript => {
    const src = getAttribute(importMapScript, 'src');
    if (src) {
      importMapPaths.push(src);
    } else if (importMapScript.childNodes && importMapScript.childNodes[0]) {
      inlineImportMaps.push(importMapScript.childNodes[0].value);
    }

    if (removeImportMaps) {
      remove(importMapScript);
    }
  });

  return { indexHTML, inlineModules, jsModules, inlineImportMaps, importMapPaths };
}

module.exports.extractResources = extractResources;
