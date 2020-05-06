import { Middleware } from 'koa';
import path from 'path';

interface HistoryAPIFallbackMiddlewareConfig {
  appIndex: string;
  appIndexDir: string;
}

/**
 * Serves index.html when a non-file request within the scope of the app index is made.
 * This allows SPA routing.
 */
export function createHistoryAPIFallbackMiddleware(
  cfg: HistoryAPIFallbackMiddlewareConfig,
): Middleware {
  return function historyAPIFallback(ctx, next) {
    if (ctx.method !== 'GET' || path.extname(ctx.path)) {
      // not a GET, or a direct file request
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
  };
}
