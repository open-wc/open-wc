import { Context, Middleware } from 'koa';
import path from 'path';
import { Plugin } from '../Plugin';

export interface PluginServeMiddlewareConfig {
  plugins: Plugin[];
}

/**
 * Sets up a middleware which allows plugins to serve files instead of looking it up in the file system.
 */
export function createPluginServeMiddlware(cfg: PluginServeMiddlewareConfig): Middleware {
  const servePlugins = cfg.plugins.filter(p => 'serve' in p);
  if (servePlugins.length === 0) {
    // nothing to serve
    return (ctx, next) => next();
  }

  return async function pluginServeMiddleware(context, next) {
    for (const plugin of servePlugins) {
      const response = await plugin.serve?.(context);

      if (response) {
        if (response.body == null) {
          throw new Error(
            'A serve result must contain a body. Use the transform hook to change only the mime type.',
          );
        }

        context.body = response.body;
        if (response.type != null) {
          context.type = response.type;
        } else {
          context.type = path.extname(path.basename(context.path));
        }

        if (response.headers) {
          for (const [k, v] of Object.entries(response.headers)) {
            context.response.set(k, v);
          }
        }

        context.status = 200;
        return;
      }
    }
    return next();
  };
}
