/**
 * @typedef {object} BasePathMiddlewareConfig
 * @property {string} basePath
 */

/**
 * Creates middleware which strips a base path from each request
 *
 * @param {BasePathMiddlewareConfig} cfg
 */
export function createBasePathMiddleware(cfg) {
  /** @type {import('koa').Middleware} */
  function basePathMiddleware(ctx, next) {
    if (ctx.url.startsWith(cfg.basePath)) {
      ctx.url = ctx.url.replace(cfg.basePath, '');
    }

    return next();
  }

  return basePathMiddleware;
}
