/** @typedef {import('parse5').Document} DocumentAst */
/** @typedef {import('./types').PolyfillsLoaderConfig} PolyfillsLoaderConfig */
/** @typedef {import('./types').GeneratedFile} GeneratedFile */

const { parse, serialize } = require('parse5');
const {
  query,
  predicates,
  setAttribute,
  insertAfter,
  append,
  cloneNode,
} = require('@open-wc/building-utils/dom5-fork');
const { createScript, findImportMapScripts } = require('@open-wc/building-utils');
const { createPolyfillsLoader } = require('./create-polyfills-loader');
const { hasFileOfType, fileTypes } = require('./utils');

/**
 * @param {DocumentAst} headAst
 * @param {Node} originalScript
 * @param {string} type
 */
function injectImportMapPolyfill(headAst, originalScript, type) {
  const systemJsScript = cloneNode(originalScript);
  setAttribute(systemJsScript, 'type', type);
  insertAfter(headAst, originalScript, systemJsScript);
}

/**
 * @param {DocumentAst} documentAst
 * @param {Node} headAst
 * @param {PolyfillsLoaderConfig} cfg
 */
function injectImportMapPolyfills(documentAst, headAst, cfg) {
  const importMapScripts = findImportMapScripts(documentAst);
  if (importMapScripts.external.length === 0 && importMapScripts.inline.length === 0) {
    return;
  }

  const polyfillSystemJs = hasFileOfType(cfg, fileTypes.SYSTEMJS);
  const polyfillEsModuleShims = hasFileOfType(cfg, fileTypes.ES_MODULE_SHIMS);

  const importMaps = /** @type {Node[]} */ ([
    ...importMapScripts.external,
    ...importMapScripts.inline,
  ]);
  importMaps.forEach(originalScript => {
    if (polyfillSystemJs) {
      injectImportMapPolyfill(headAst, originalScript, 'systemjs-importmap');
    }

    if (polyfillEsModuleShims) {
      injectImportMapPolyfill(headAst, originalScript, 'importmap-shim');
    }
  });
}

/**
 * Transforms an index.html file, injecting a polyfills loader for
 * compatibility with older browsers.
 *
 * @param {string} htmlString
 * @param {PolyfillsLoaderConfig} cfg
 * @returns {{ htmlString: string, polyfillFiles: GeneratedFile[] }}
 */
function injectPolyfillsLoader(htmlString, cfg) {
  const documentAst = parse(htmlString);

  const headAst = query(documentAst, predicates.hasTagName('head'));
  const bodyAst = query(documentAst, predicates.hasTagName('body'));

  if (!headAst || !bodyAst) {
    throw new Error(`Invalid index.html: missing <head> or <body>`);
  }

  const polyfillsLoader = createPolyfillsLoader(cfg);

  if (polyfillsLoader === null) {
    return { htmlString, polyfillFiles: [] };
  }

  const loaderScript = createScript({}, polyfillsLoader.code);
  append(bodyAst, loaderScript);

  injectImportMapPolyfills(documentAst, headAst, cfg);

  return {
    htmlString: serialize(documentAst),
    polyfillFiles: polyfillsLoader.polyfillFiles,
  };
}

module.exports = {
  injectPolyfillsLoader,
};
