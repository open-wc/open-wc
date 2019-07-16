import { extractResources, createIndexHTML } from '@open-wc/building-utils/index-html/index.js';
import path from 'path';
import { getBodyAsString, toBrowserPath } from '../utils.js';
import { compatibilityModes, modernPolyfills, legacyPolyfills } from '../constants.js';
import systemJsLegacyResolveScript from '../browser-scripts/system-js-legacy-resolve.js';

const htmlTags = ['html', 'head', 'body'];

/**
 * @typedef {object} CompatibilityMiddlewareConfig
 * @property {string} appIndex
 * @property {string} appIndexDir
 * @property {string} compatibilityMode
 */

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
 * Returns whether this is a index html response.
 * @param {import('koa').Context} ctx
 * @param {CompatibilityMiddlewareConfig} cfg
 */
async function getIndexHTMLResponse(ctx, cfg) {
  if (ctx.status < 200 || ctx.status >= 300) {
    return false;
  }

  // if we're serving the app index, it's an index html response
  if (ctx.url === cfg.appIndex) {
    return getBodyAsString(ctx.body);
  }

  // make the check based on content-type and check
  const contentType = ctx.response.header && ctx.response.header['content-type'];
  if (!contentType || !contentType.includes('text/html')) {
    return false;
  }

  const indexHTMLString = await getBodyAsString(ctx.body);
  if (
    !htmlTags.some(
      tag => indexHTMLString.includes(`<${tag}`) && indexHTMLString.includes(`</${tag}>`),
    )
  ) {
    return false;
  }

  return indexHTMLString;
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
  /** @type {Map<string, { body: string, lastModified: string }>} */
  const cachedHTMLs = new Map();

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
      ctx.response.set('cache-control', 'public, max-age=31536000');
      ctx.response.set('content-type', 'text/javascript');
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
    const indexHTMLString = await getIndexHTMLResponse(ctx, cfg);
    if (!indexHTMLString) {
      return;
    }

    const lastModified = ctx.response.headers['last-modified'];

    // return cached index.html if it did not change
    const cache = cachedHTMLs.get(ctx.url);
    if (cache && cache.lastModified === lastModified) {
      ctx.body = cache.body;
      return;
    }

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
    cachedHTMLs.set(ctx.url, { body: indexHTML, lastModified });

    // cache polyfills for serving
    createResult.files.forEach(file => {
      let root = ctx.url.endsWith('/') ? ctx.url : path.posix.dirname(ctx.url);
      if (!root.endsWith('/')) {
        root = `${root}/`;
      }
      polyfills.set(`${root}${toBrowserPath(file.path)}`, file.content);
    });
  }

  return compatibilityMiddleware;
}
