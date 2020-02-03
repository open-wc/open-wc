/** @typedef {import('parse5').Document} DocumentAst */
/** @typedef {import('parse5').Node} NodeAst */
/** @typedef {import('./inject-polyfills-loader-types').InjectPolyfillsLoaderConfig} InjectPolyfillsLoaderConfig */
/** @typedef {import('polyfills-loader').File} File */
/** @typedef {import('polyfills-loader').GeneratedFile} GeneratedFile */
/** @typedef {import('polyfills-loader').PolyfillsConfig} PolyfillsConfig */

import {
  getAttribute,
  getTextContent,
  remove,
  setTextContent,
} from '@open-wc/building-utils/dom5-fork/index.js';
import { findJsScripts } from '@open-wc/building-utils';
import { parse, serialize } from 'parse5';
import path from 'path';
import deepmerge from 'deepmerge';
import {
  injectPolyfillsLoader as originalInjectPolyfillsLoader,
  fileTypes,
  getScriptFileType,
} from 'polyfills-loader';

import sytemJsTransformResolver from '../browser-scripts/systemjs-transform-resolver.js';
import { compatibilityModes } from '../constants.js';
import { logDebug } from './utils.js';

/** @type {PolyfillsConfig} */
const allPolyfills = {
  coreJs: true,
  regeneratorRuntime: true,
  fetch: true,
  webcomponents: true,
};

/** @type {PolyfillsConfig} */
const allPolyfillsWithSystemjs = {
  ...allPolyfills,
  custom: [
    {
      name: 'systemjs',
      path: require.resolve('systemjs/dist/system.min.js'),
      initializer: sytemJsTransformResolver,
    },
  ],
};

/**
 * In max compatibility mode, we need to load the regenerator runtime on all browsers since
 * we're always compiling to es5.
 */
/** @type {PolyfillsConfig} */
const maxPolyfills = {
  ...allPolyfillsWithSystemjs,
  regeneratorRuntime: 'always',
};

/**
 * @param {InjectPolyfillsLoaderConfig} cfg
 * @returns {PolyfillsConfig}
 */
function getPolyfillsConfig(cfg) {
  switch (cfg.compatibilityMode) {
    case compatibilityModes.MAX:
      return maxPolyfills;
    case compatibilityModes.MIN:
      return allPolyfills;
    case compatibilityModes.AUTO:
    case compatibilityModes.ALWAYS:
      if (cfg.compatibilityMode === compatibilityModes.AUTO && cfg.uaCompat.modern) {
        return {};
      }

      if (cfg.uaCompat.supportsEsm) {
        return allPolyfills;
      }
      return allPolyfillsWithSystemjs;
    default:
      return {};
  }
}

/**
 * @param {InjectPolyfillsLoaderConfig} cfg
 * @param {DocumentAst} documentAst
 */
function findScripts(cfg, documentAst) {
  const scriptNodes = findJsScripts(
    documentAst,
    cfg.polyfillsLoaderConfig && cfg.polyfillsLoaderConfig.exclude,
  );

  /** @type {File[]}  */
  const files = [];
  /** @type {GeneratedFile[]} */
  const inlineScripts = [];
  const inlineScriptNodes = [];
  scriptNodes.forEach((scriptNode, i) => {
    const type = getScriptFileType(scriptNode);
    let src = getAttribute(scriptNode, 'src');

    if (!src) {
      src = `inline-script-${i}.js?source=${encodeURIComponent(cfg.indexUrl)}`;
      inlineScripts.push({
        path: src,
        type,
        content: getTextContent(scriptNode),
      });
      inlineScriptNodes.push(scriptNode);
    }

    files.push({
      type,
      path: src,
    });
  });

  return { files, inlineScripts, scriptNodes, inlineScriptNodes };
}

/**
 * @param {PolyfillsConfig} polyfills
 */
function hasPolyfills(polyfills) {
  const { hash, custom, ...rest } = polyfills;
  return (custom && custom.length > 0) || Object.values(rest).some(v => v !== false);
}

/**
 * @param {InjectPolyfillsLoaderConfig} cfg
 * @param {NodeAst[]} inlineScriptNodes
 */
async function transformInlineScripts(cfg, inlineScriptNodes) {
  const asyncTransforms = [];

  for (const scriptNode of inlineScriptNodes) {
    // we need to refer to an actual file for node resolve to work properly
    const filePath = cfg.indexFilePath.endsWith(path.sep)
      ? path.join(cfg.indexFilePath, 'index.html')
      : cfg.indexFilePath;

    const asyncTransform = cfg
      .transformJs({
        filePath,
        uaCompat: cfg.uaCompat,
        code: getTextContent(scriptNode),
        transformModule: false,
      })
      .then(code => {
        setTextContent(scriptNode, code);
      });
    asyncTransforms.push(asyncTransform);
  }

  await Promise.all(asyncTransforms);
}

/**
 * transforms index.html, extracting any modules and import maps and adds them back
 * with the appropriate polyfills, shims and a script loader so that they can be loaded
 * at the right time
 *
 * @param {InjectPolyfillsLoaderConfig} cfg
 * @returns {Promise<{ indexHTML: string, inlineScripts: GeneratedFile[], polyfills: GeneratedFile[] }>}
 */
export async function injectPolyfillsLoader(cfg) {
  const polyfillModules =
    ([compatibilityModes.AUTO, compatibilityModes.ALWAYS].includes(cfg.compatibilityMode) &&
      !cfg.uaCompat.supportsEsm) ||
    cfg.compatibilityMode === compatibilityModes.MAX;

  const documentAst = parse(cfg.htmlString);
  const { files, inlineScripts, scriptNodes, inlineScriptNodes } = findScripts(cfg, documentAst);

  const polyfillsConfig = getPolyfillsConfig(cfg);
  const polyfillsLoaderConfig = deepmerge(
    {
      modern: {
        files: files.map(f => ({
          ...f,
          type: f.type === fileTypes.MODULE && polyfillModules ? fileTypes.SYSTEMJS : f.type,
        })),
      },
      polyfills: polyfillsConfig,
    },
    cfg.polyfillsLoaderConfig || {},
  );

  if (!hasPolyfills(polyfillsLoaderConfig.polyfills) && !polyfillModules) {
    // no polyfils module polyfills, so we don't need to inject a loader
    if (inlineScripts && inlineScripts.length > 0) {
      // there are inline scripts, we need to transform them
      // transformInlineScripts mutates documentAst
      await transformInlineScripts(cfg, inlineScriptNodes);
      return { indexHTML: serialize(documentAst), inlineScripts, polyfills: [] };
    }
    return { indexHTML: cfg.htmlString, inlineScripts: [], polyfills: [] };
  }

  // we will inject a loader, so we need to remove the inline script nodes as the loader
  // will include them as virtual modules
  for (const scriptNode of scriptNodes) {
    // remove script from document
    remove(scriptNode);
  }

  logDebug('[polyfills-loader] config', polyfillsLoaderConfig);

  const result = originalInjectPolyfillsLoader(serialize(documentAst), polyfillsLoaderConfig);

  logDebug(
    '[polyfills-loader] generated polyfills: ',
    result.polyfillFiles.map(p => ({ ...p, content: '[stripped]' })),
  );

  logDebug(
    'Inline scripts generated by polyfills-loader',
    inlineScripts.map(p => ({ ...p, content: '[stripped]' })),
  );

  return {
    indexHTML: result.htmlString,
    inlineScripts,
    polyfills: result.polyfillFiles,
  };
}
