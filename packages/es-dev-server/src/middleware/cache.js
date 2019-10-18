/**
 * Returns 304 response for cacheable requests
 */
export function createCacheMiddleware() {
  /** @type {import('koa').Middleware} */
  async function cacheMiddleware(ctx, next) {
    await next();

    if (!ctx.body || ctx.status === 304) {
      return;
    }

    if (!['GET', 'HEAD'].includes(ctx.method)) {
      return;
    }

    if (ctx.status < 200 || ctx.status >= 300) {
      return;
    }

    // let koa check if the respone is still fresh this means
    // the etags of the request and response match, so the browser
    // still has a fresh copy so it doesn't need to re-download it
    if (ctx.fresh) {
      ctx.status = 304;
      ctx.response.remove('content-type');
      ctx.response.remove('content-length');
    }

    // don't send last-modified since it doesn't do microseconds
    ctx.response.remove('last-modified');
  }

  return cacheMiddleware;
}
