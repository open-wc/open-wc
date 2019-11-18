import { extractResources, createIndexHTML } from '@open-wc/building-utils/index-html/index.js';
import { polyfillsPresets } from './polyfills-presets.js';
import { addPolyfilledImportMaps } from './import-maps.js';
import { compatibilityModes, virtualFilePrefix, polyfillsModes } from '../constants.js';

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
      return cfg.uaCompat.supportsEsm ? polyfillsPresets.all : polyfillsPresets.allWithSystemjs;
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
    (cfg.compatibilityMode === compatibilityModes.AUTO && !cfg.uaCompat.supportsEsm) ||
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
    ...[...inlineModules.keys()].map(
      e => `${virtualFilePrefix}${e}?source=${encodeURIComponent(cfg.indexUrl)}`,
    ),
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

  return {
    indexHTML,
    inlineModules,
    polyfills: createResult.files,
  };
}
