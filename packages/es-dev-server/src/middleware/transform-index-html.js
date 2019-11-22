/* eslint-disable no-console */
import path from 'path';
import { URLSearchParams } from 'url';
import { getTransformedIndexHTML } from '../utils/transform-index-html.js';
import {
  isIndexHTMLResponse,
  getBodyAsString,
  toBrowserPath,
  isInlineModule,
  RequestCancelledError,
} from '../utils/utils.js';
import { getUserAgentCompat } from '../utils/user-agent-compat.js';
import { compatibilityModes } from '../constants.js';

/**
 * @typedef {object} TransformIndexHTMLMiddlewareConfig
 * @property {string} appIndex
 * @property {string} appIndexDir
 * @property {string} compatibilityMode
 * @property {string} polyfillsMode
 */

/**
 * @typedef {object} IndexHTMLData
 * @property {string} indexHTML
 * @property {string} lastModified
 * @property {Map<string, string>} inlineModules
 */

/**
 * Creates middleware which injects polyfills and code into the served application which allows
 * it to run on legacy browsers.
 *
 * @param {TransformIndexHTMLMiddlewareConfig} cfg
 */
export function createTransformIndexHTMLMiddleware(cfg) {
  // polyfills, keyed by url
  /** @type {Map<string, string>} */
  const polyfills = new Map();

  // index html data, keyed by url
  /** @type {Map<string, IndexHTMLData>} */
  const indexHTMLData = new Map();

  /** @type {import('koa').Middleware} */
  async function transformIndexHTMLMiddleware(ctx, next) {
    const uaCompat = getUserAgentCompat(ctx);
    if (uaCompat.modern && cfg.compatibilityMode === compatibilityModes.AUTO) {
      return next();
    }

    // serve polyfill from memory if url matches
    const polyfill = polyfills.get(ctx.url);
    if (polyfill) {
      ctx.body = polyfill;
      // aggresively cache polyfills, they are hashed so content changes bust the cache
      ctx.response.set('cache-control', 'public, max-age=31536000');
      ctx.response.set('content-type', 'text/javascript');
      return undefined;
    }

    /**
     * serve extracted inline module if url matches. an inline module requests has this
     * structure:
     * `/inline-module-<index>?source=<index-html-path>`
     * for example:
     * `/inline-module-2?source=/src/index-html`
     * source query parameter is the index.html the inline module came from, index is the index
     * of the inline module in that index.html. We use these to look up the correct code to
     * serve
     */
    if (isInlineModule(ctx.url)) {
      const [url, queryString] = ctx.url.split('?');
      const params = new URLSearchParams(queryString);
      const indexHTML = indexHTMLData.get(
        uaCompat.browserTarget + decodeURIComponent(params.get('source')),
      );
      const name = path.basename(url);
      const inlineModule = indexHTML.inlineModules.get(name);
      if (!inlineModule) {
        throw new Error(`Could not find inline module for ${ctx.url}`);
      }

      ctx.body = inlineModule;
      ctx.response.set('content-type', 'text/javascript');
      ctx.response.set('cache-control', 'no-cache');
      ctx.response.set('last-modified', indexHTML.lastModified);
      return undefined;
    }

    await next();

    // check if we are serving an index.html
    if (!(await isIndexHTMLResponse(ctx, cfg.appIndex))) {
      return undefined;
    }

    const lastModified = ctx.response.headers['last-modified'];

    // return cached index.html if it did not change
    const data = indexHTMLData.get(uaCompat.browserTarget + ctx.url);
    if (data && data.lastModified === lastModified) {
      ctx.body = data.indexHTML;
      return undefined;
    }

    try {
      // transforms index.html to make the code load correctly with the right polyfills and shims
      const indexHTMLString = await getBodyAsString(ctx);
      const transformResult = getTransformedIndexHTML({
        indexUrl: ctx.url,
        indexHTMLString,
        compatibilityMode: cfg.compatibilityMode,
        polyfillsMode: cfg.polyfillsMode,
        uaCompat,
      });

      // add new index.html
      ctx.body = transformResult.indexHTML;

      // cache index for later use
      indexHTMLData.set(uaCompat.browserTarget + ctx.url, { ...transformResult, lastModified });

      // cache polyfills for serving
      transformResult.polyfills.forEach(p => {
        let root = ctx.url.endsWith('/') ? ctx.url : path.posix.dirname(ctx.url);
        if (!root.endsWith('/')) {
          root = `${root}/`;
        }
        polyfills.set(`${root}${toBrowserPath(p.path)}`, p.content);
      });
    } catch (error) {
      if (error instanceof RequestCancelledError) {
        return undefined;
      }
      throw error;
    }
    return undefined;
  }

  return transformIndexHTMLMiddleware;
}
