import { extractResources, createIndexHTML } from '@open-wc/building-utils/index-html/index.js';
import { polyfills } from './polyfills.js';
import { addPolyfilledImportMaps } from './import-maps.js';
import { compatibilityModes, virtualFilePrefix } from '../constants.js';

/**
 * transforms index.html, extracting any modules and import maps and adds them back
 * with the appropriate polyfills, shims and a script loader so that they can be loaded
 * at the right time
 * @param {string} indexUrl
 * @param {string} indexHTMLString
 * @param {string} compatibilityMode
 * @param {import('./user-agent-compat').UserAgentCompat} uaCompat
 */
export function getTransformedIndexHTML(indexUrl, indexHTMLString, compatibilityMode, uaCompat) {
  const polyfillModules =
    (compatibilityMode === compatibilityModes.AUTO && !uaCompat.supportsEsm) ||
    compatibilityMode === compatibilityModes.MAX;

  // extract input files from index.html
  const resources = extractResources(indexHTMLString, { removeImportMaps: false });
  /** @type {Map<string, string>} */
  const inlineModules = new Map();

  resources.inlineModules.forEach((content, i) => {
    inlineModules.set(`inline-module-${i}.js`, content);
  });

  const files = [
    ...resources.jsModules,
    ...[...inlineModules.keys()].map(
      e => `${virtualFilePrefix}${e}?source=${encodeURIComponent(indexUrl)}`,
    ),
  ];

  if (files.length === 0) {
    return {
      indexHTML: indexHTMLString,
      inlineModules: new Map(),
      polyfills: [],
    };
  }

  // create a new index.html with injected polyfills and loader script
  const createResult = createIndexHTML(resources.indexHTML, {
    entries: {
      type: polyfillModules ? 'system' : 'module',
      files,
    },
    polyfills,
    minify: false,
    preload: false,
  });

  let { indexHTML } = createResult;
  if (polyfillModules) {
    indexHTML = addPolyfilledImportMaps(indexHTML, resources);
  } else {
    // this is needed because @open-wc/building-utils uses importShim to import the main app
    // but we don't use modules on browsers without dynamic imports, so we can just alias it
    indexHTML = indexHTML.replace(
      '<script>',
      '<script>window.importShim = s => import(s);</script><script>',
    );
  }

  return {
    indexHTML,
    inlineModules,
    polyfills: createResult.files,
  };
}
