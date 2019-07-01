import { extractResources, createIndexHTML } from '@open-wc/building-utils/index-html';
import { getBodyAsString } from '../utils';
import { compatibilityModes } from '../constants';
import systemJsLegacyResolveScript from '../browser-scripts/system-js-legacy-resolve.js';

/**
 * @typedef {object} CompatibilityMiddlewareConfig
 * @property {string} appIndex
 * @property {string} appIndexDir
 * @property {string} compatibilityMode
 */

/** @type {import('@open-wc/building-utils/index-html/create-index-html').PolyfillsConfig} */
const modernPolyfills = {
  webcomponents: true,
  esModuleShims: true,
};

/** @type {import('@open-wc/building-utils/index-html/create-index-html').PolyfillsConfig} */
const legacyPolyfills = {
  ...modernPolyfills,
  coreJs: true,
  regeneratorRuntime: true,
  fetch: true,
  systemJsExtended: true,
};

function injectImportMaps(indexHTML, resources, type) {
  let transformedIndexHTML = indexHTML;

  if (resources.inlineImportMaps) {
    resources.inlineImportMaps.forEach(importMap => {
      transformedIndexHTML = indexHTML.replace(
        '<head>',
        `<head><script type="${type}">${importMap}</script>`,
      );
    });
  }

  if (resources.importMapPaths) {
    resources.importMapPaths.forEach(importMapPath => {
      transformedIndexHTML = indexHTML.replace(
        '<head>',
        `<head><script type="${type}" src="${importMapPath}"></script>`,
      );
    });
  }

  return transformedIndexHTML;
}

/**
 * Creates middleware which injects polyfills and code into the served application which allows
 * it to run on legacy browsers.
 *
 * @param {CompatibilityMiddlewareConfig} cfg
 */
export function createCompatibilityMiddleware(cfg) {
  const { compatibilityMode: compatMode } = cfg;
  /** @type {Map<string, string>} */
  const polyfills = new Map();
  /** @type {{ body: string, lastModified: string }} */
  let cachedIndexHTML;

  if (!compatMode || compatMode === compatibilityModes.NONE) {
    throw new Error(
      'Transform index middleware should not be created when compatibility mode is not turned on',
    );
  }

  // Currently we only have two compat modes: modern and all, so we can work with just a boolean
  const modernOnly = compatMode === compatibilityModes.MODERN;

  /** @type {import('koa').Middleware} */
  async function compatibilityMiddleware(ctx, next) {
    // serve polyfill from memory if requested
    const polyfill = polyfills.get(ctx.url);
    if (polyfill) {
      ctx.body = polyfill;
      // aggresively cache polyfills, they are hashed so content bust the cache
      ctx.response.append('Cache-Control', 'public, max-age=31536000');
      return;
    }

    await next();

    /**
     * If index.html is served, inject code for compatibility with legacy browsers.
     *
     * In order to make code compatible, we scan for any modules and extract them. Then
     * the modules are re-injected along with a loader script. This loader script first
     * loads any necessary polyfills, and then loads the user's modules.
     *
     * Modules are loaded through es-module-shims for modern browsers, for browsers which
     * don't support modules the code is loaded by systemjs and compiled to es5.
     */
    if (ctx.url === cfg.appIndex) {
      const lastModified = ctx.response.headers['last-modified'];

      // return cached index.html if it did not change
      if (cachedIndexHTML) {
        if (cachedIndexHTML.lastModified === lastModified) {
          ctx.body = cachedIndexHTML.body;
          return;
        }
      }

      // read served index.html
      const indexHTMLString = await getBodyAsString(ctx.body);

      // extract input files from index.html
      const resources = extractResources(indexHTMLString);
      if (resources.inlineModules.length > 0) {
        throw new Error(
          `Compatibility cannot handle "inline" modules (modules without a src attribute). Place your js code in a separate file.`,
        );
      }

      if (!resources.jsModules || resources.jsModules.length === 0) {
        throw new Error(
          `Compatibility mode requires at least one <script type="module" src="..."> in your index.html.`,
        );
      }

      const files = resources.jsModules.map(e => e.replace('./', ''));

      // create a new index.html with injected polyfills and loader script
      const createResult = createIndexHTML(resources.indexHTML, {
        entries: {
          type: 'module',
          files,
        },
        legacyEntries: modernOnly
          ? undefined
          : {
              type: 'system',
              files,
            },
        polyfills: modernOnly ? modernPolyfills : legacyPolyfills,
        minify: false,
        preload: false,
      });

      let { indexHTML } = createResult;

      // if there were any importmaps, they were extracted. re-add them as an importmap shim
      indexHTML = injectImportMaps(indexHTML, resources, 'importmap-shim');

      if (!modernOnly) {
        // if we need to support legacy browsers, also add systemjs-importmap
        indexHTML = injectImportMaps(indexHTML, resources, 'systemjs-importmap');

        // inject systemjs resolver which appends a query param to trigger es5 compilation
        indexHTML = indexHTML.replace('</body>', `${systemJsLegacyResolveScript}</body>`);
      }

      // add new index.html
      ctx.body = indexHTML;

      // cache index for later use
      cachedIndexHTML = { body: indexHTML, lastModified };

      // cache polyfills for serving
      createResult.files.forEach(file => {
        polyfills.set(`${cfg.appIndexDir}/${file.path}`, file.content);
      });
    }
  }

  return compatibilityMiddleware;
}
