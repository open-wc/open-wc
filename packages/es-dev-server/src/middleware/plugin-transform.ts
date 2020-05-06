import { Context, Middleware } from 'koa';
import path from 'path';
import { Plugin } from '../Plugin';
import { getBodyAsString, RequestCancelledError, isUtf8 } from '../utils/utils';

export interface PluginServeMiddlewareConfig {
  plugins: Plugin[];
}

/**
 * Sets up a middleware which allows plugins to transform files before they are served to the browser.
 */
export function createPluginTransformMiddlware(cfg: PluginServeMiddlewareConfig): Middleware {
  const transformPlugins = cfg.plugins.filter(p => 'transform' in p);
  if (transformPlugins.length === 0) {
    // nothing to transform
    return (ctx, next) => next();
  }

  return async function pluginTransformMiddleware(context, next) {
    await next();

    if (context.status < 200 || context.status >= 300) {
      return undefined;
    }

    if (!isUtf8(context)) {
      return undefined;
    }

    // responses are streams initially, but to allow transforming we turn it
    // into a string first
    try {
      context.body = await getBodyAsString(context);
    } catch (error) {
      if (error instanceof RequestCancelledError) {
        return undefined;
      }
      return undefined;
    }

    for (const plugin of transformPlugins) {
      const response = await plugin.transform?.(context);
      if (response) {
        if (response.body != null) {
          context.body = response.body;
        }

        if (response.headers) {
          for (const [k, v] of Object.entries(response.headers)) {
            context.response.set(k, v);
          }
        }
      }
    }
  };
}
