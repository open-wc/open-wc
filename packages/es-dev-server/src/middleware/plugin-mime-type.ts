import { Context, Middleware } from 'koa';
import path from 'path';
import { Plugin } from '../Plugin';
import { getBodyAsString, RequestCancelledError, isUtf8 } from '../utils/utils';

export interface PluginServeMiddlewareConfig {
  plugins: Plugin[];
}

/**
 * Sets up a middleware which allows plugins to resolve the mime type.
 */
export function createPluginMimeTypeMiddleware(cfg: PluginServeMiddlewareConfig): Middleware {
  const mimeTypePlugins = cfg.plugins.filter(p => 'resolveMimeType' in p);
  if (mimeTypePlugins.length === 0) {
    // nothing to transform
    return (ctx, next) => next();
  }

  return async function pluginMimeTypeMiddleware(context, next) {
    await next();

    if (context.status < 200 || context.status >= 300) {
      return undefined;
    }

    for (const plugin of mimeTypePlugins) {
      const type = await plugin.resolveMimeType?.(context);
      if (type) {
        context.type = type;
      }
    }
  };
}
