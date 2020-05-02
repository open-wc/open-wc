import { Middleware } from 'koa';

export interface BasePathMiddlewareConfig {
  basePath: string;
}

/**
 * Creates middleware which strips a base path from each request
 */
export function createBasePathMiddleware(cfg: BasePathMiddlewareConfig): Middleware {
  return function basePathMiddleware(ctx, next) {
    if (ctx.url.startsWith(cfg.basePath)) {
      ctx.url = ctx.url.replace(cfg.basePath, '');
    }

    return next();
  };
}
