const { parse } = require('parse5');
const { queryAll, predicates, getAttribute, remove } = require('../dom5-fork');

/**
 * @typedef {object} ExtractResult
 * @property {import('parse5').ASTNode} indexHTML the index file, with resources removed
 * @property {string[]} jsModules paths to js modules that were found
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
  const jsModules = [];

  moduleScripts.forEach(moduleScript => {
    const src = getAttribute(moduleScript, 'src');
    if (src) {
      jsModules.push(src);
      remove(moduleScript);
    }
  });

  // TODO: Also extract other kinds of resources
  return { indexHTML, jsModules };
}

module.exports.extractResources = extractResources;
