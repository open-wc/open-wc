import { extractResources, createIndexHTML } from '@open-wc/building-utils/index-html/index.js';
import { compatibilityModes } from '../constants.js';
import systemJsLegacyResolveScript from '../browser-scripts/system-js-legacy-resolve.js';
import { getPolyfills } from './polyfills.js';
import { addPolyfilledImportMaps } from './import-maps.js';

/**
 * transforms index.html, extracting any modules and import maps and adds them back
 * with the appropriate polyfills, shims and a script loader so that they can be loaded
 * at the right time
 * @param {string} indexUrl
 * @param {string} indexHTMLString
 * @param {string} compatibilityMode
 */
export function getTransformedIndexHTML(indexUrl, indexHTMLString, compatibilityMode) {
  // extract input files from index.html
  const resources = extractResources(indexHTMLString, { removeImportMaps: false });
  /** @type {Map<string, string>} */
  const inlineModules = new Map();

  resources.inlineModules.forEach((content, i) => {
    inlineModules.set(`inline-module-${i}.js`, content);
  });

  const files = [
    // remove leading ./
    ...resources.jsModules.map(e => e.replace('./', '')),
    ...[...inlineModules.keys()].map(e => `${e}?source=${encodeURIComponent(indexUrl)}`),
  ];

  // create a new index.html with injected polyfills and loader script
  const createResult = createIndexHTML(resources.indexHTML, {
    entries: {
      type: 'module',
      files,
    },
    legacyEntries:
      compatibilityMode !== compatibilityModes.ALL
        ? undefined
        : {
            type: 'system',
            files,
          },
    polyfills: getPolyfills(compatibilityMode),
    minify: false,
    preload: false,
  });

  let { indexHTML } = createResult;
  indexHTML = addPolyfilledImportMaps(indexHTML, compatibilityMode, resources);

  // inject systemjs resolver which appends a query param to trigger es5 compilation
  indexHTML = indexHTML.replace('</body>', `${systemJsLegacyResolveScript}</body>`);

  return {
    indexHTML,
    inlineModules,
    polyfills: createResult.files,
  };
}
