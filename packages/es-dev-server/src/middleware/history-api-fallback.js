/**
 * @typedef {object} HistoryAPIFallbackMiddlewareConfig
 * @property {string} appIndex
 * @property {string} appIndexDir
 */

/**
 * Serves index.html when a non-file request within the scope of the app index is made.
 * This allows SPA routing.
 *
 * @param {HistoryAPIFallbackMiddlewareConfig} cfg
 */
export function createHistoryAPIFallbackMiddleware(cfg) {
  /** @type {import('koa').Middleware} */
  function historyAPIFallback(ctx, next) {
    // . character hints at a file request (could possibly check with regex for file ext)
    const cleanUrl = ctx.url.split('?')[0].split('#')[0];
    if (ctx.method !== 'GET' || cleanUrl.includes('.')) {
      return next();
    }

    if (!ctx.headers || typeof ctx.headers.accept !== 'string') {
      return next();
    }

    if (ctx.headers.accept.includes('application/json')) {
      return next();
    }

    if (!(ctx.headers.accept.includes('text/html') || ctx.headers.accept.includes('*/*'))) {
      return next();
    }

    if (!ctx.url.startsWith(cfg.appIndexDir)) {
      return next();
    }

    // rewrite url and let static serve take it further
    ctx.url = cfg.appIndex;
    return next();
  }

  return historyAPIFallback;
}
