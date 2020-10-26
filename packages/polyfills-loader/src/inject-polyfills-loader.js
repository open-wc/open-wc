/** @typedef {import('parse5').Document} DocumentAst */
/** @typedef {import('./types').PolyfillsLoaderConfig} PolyfillsLoaderConfig */
/** @typedef {import('./types').PolyfillsLoader} PolyfillsLoader */
/** @typedef {import('./types').GeneratedFile} GeneratedFile */

const { parse, serialize } = require('parse5');
const {
  query,
  predicates,
  setAttribute,
  insertAfter,
  append,
  cloneNode,
  // @ts-ignore
} = require('@open-wc/building-utils/dom5-fork');
// @ts-ignore
const { createScript, createElement, findImportMapScripts } = require('@open-wc/building-utils');
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
 * @param {*} bodyAst
 * @param {PolyfillsLoader} polyfillsLoader
 */
function injectLoaderScript(bodyAst, polyfillsLoader) {
  const loaderScript = createScript({}, polyfillsLoader.code);
  append(bodyAst, loaderScript);
}

/**
 * @param {any} headAst
 * @param {PolyfillsLoaderConfig} cfg
 */
function injectPrefetchLinks(headAst, cfg) {
  // @ts-ignore
  for (const file of cfg.modern.files) {
    const { path } = file;
    const href = path.startsWith('.') || path.startsWith('/') ? path : `./${path}`;
    if ([fileTypes.MODULE, fileTypes.ES_MODULE_SHIMS].includes(file.type)) {
      append(
        headAst,
        createElement('link', {
          rel: 'preload',
          href,
          as: 'script',
          crossorigin: 'anonymous',
        }),
      );
    } else {
      append(headAst, createElement('link', { rel: 'preload', href, as: 'script' }));
    }
  }
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

  if (cfg.preload) {
    injectPrefetchLinks(headAst, cfg);
  }
  injectImportMapPolyfills(documentAst, headAst, cfg);
  injectLoaderScript(bodyAst, polyfillsLoader);

  return {
    htmlString: serialize(documentAst),
    polyfillFiles: polyfillsLoader.polyfillFiles,
  };
}

module.exports = {
  injectPolyfillsLoader,
};
