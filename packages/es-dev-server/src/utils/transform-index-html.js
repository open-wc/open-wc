import { extractResources, createIndexHTML } from '@open-wc/building-utils/index-html/index.js';
import systemJsLegacyResolveScript from '../browser-scripts/system-js-legacy-resolve.js';
import { polyfillsPresets } from './polyfills-presets.js';
import { addPolyfilledImportMaps } from './import-maps.js';
import { compatibilityModes, polyfillsModes } from '../constants.js';

/**
 * @typedef {object} TransformIndexHTMLConfig
 * @property {string} indexUrl
 * @property {string} indexHTMLString
 * @property {string} compatibilityMode
 * @property {string} polyfillsMode
 * @property {import('./user-agent-compat').UserAgentCompat} uaCompat
 */

/**
 * @param {TransformIndexHTMLConfig} cfg
 */
function getPolyfills(cfg) {
  if (cfg.polyfillsMode === polyfillsModes.NONE) {
    return {};
  }

  switch (cfg.compatibilityMode) {
    case compatibilityModes.MAX:
      return polyfillsPresets.allWithSystemjs;
    case compatibilityModes.MIN:
      return polyfillsPresets.all;
    case compatibilityModes.AUTO:
    case compatibilityModes.ALWAYS:
      if (cfg.compatibilityMode === compatibilityModes.AUTO && cfg.uaCompat.modern) {
        return {};
      }

      if (cfg.uaCompat.supportsEsm) {
        return polyfillsPresets.all;
      }
      return polyfillsPresets.allWithSystemjs;
    default:
      return {};
  }
}

/**
 * transforms index.html, extracting any modules and import maps and adds them back
 * with the appropriate polyfills, shims and a script loader so that they can be loaded
 * at the right time
 *
 * @param {TransformIndexHTMLConfig} cfg
 */
export function getTransformedIndexHTML(cfg) {
  const polyfillModules =
    ([compatibilityModes.AUTO, compatibilityModes.ALWAYS].includes(cfg.compatibilityMode) &&
      !cfg.uaCompat.supportsEsm) ||
    cfg.compatibilityMode === compatibilityModes.MAX;

  // extract input files from index.html
  const resources = extractResources(cfg.indexHTMLString, { removeImportMaps: false });
  /** @type {Map<string, string>} */
  const inlineModules = new Map();

  resources.inlineModules.forEach((content, i) => {
    inlineModules.set(`inline-module-${i}.js`, content);
  });

  const files = [
    ...resources.jsModules,
    ...[...inlineModules.keys()].map(e => `${e}?source=${encodeURIComponent(cfg.indexUrl)}`),
  ];

  if (files.length === 0) {
    return {
      indexHTML: cfg.indexHTMLString,
      inlineModules: new Map(),
      polyfills: [],
    };
  }

  // create a new index.html with injected polyfills and loader script
  const createResult = createIndexHTML(resources.indexHTML, {
    entries: {
      type: polyfillModules ? 'system' : 'module',
      polyfillDynamicImport: false,
      files,
    },
    polyfills: getPolyfills(cfg),
    minify: false,
    preload: false,
  });

  let { indexHTML } = createResult;
  if (polyfillModules) {
    indexHTML = addPolyfilledImportMaps(indexHTML, resources);
  }

  // inject systemjs resolver which appends a query param to trigger es5 compilation
  if (polyfillModules) {
    indexHTML = indexHTML.replace('</body>', `${systemJsLegacyResolveScript}</body>`);
  }

  return {
    indexHTML,
    inlineModules,
    polyfills: createResult.files,
  };
}
