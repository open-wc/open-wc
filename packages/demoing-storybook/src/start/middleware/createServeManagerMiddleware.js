module.exports = function createServeManagerMiddleware(assets) {
  /**
   * Serve manager form a middleware, so that the dev server doesn't inject
   * compatibility or watch code.
   */
  return function serveManagerMiddleware(ctx, next) {
    const cleanURL = ctx.url.split('?')[0].split('#')[0];

    if (cleanURL === '/' || cleanURL === '/index.html') {
      ctx.body = assets.indexHTML;
      ctx.status = 200;
      ctx.response.set('content-type', 'text/html');
      return null;
    }

    if (cleanURL === assets.managerScriptUrl) {
      ctx.body = assets.managerCode;
      ctx.status = 200;
      ctx.response.set('content-type', 'text/javascript');
      // the manager code is hashed, so we can cache it forever
      ctx.response.set('cache-control', 'public, max-age=31536000');
      return null;
    }
    return next();
  };
};
