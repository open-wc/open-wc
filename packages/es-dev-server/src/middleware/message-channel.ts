import { Context, Middleware } from 'koa';
import { isIndexHTMLResponse, getBodyAsString, RequestCancelledError } from '../utils/utils';
import { setupMessageChannel } from '../utils/message-channel';
import { messageChannelEndpoint } from '../constants';
import messageChannelScript from '../browser-scripts/message-channel';

interface MessageChannelMiddlewareConfig {
  appIndex?: string;
  rootDir: string;
}

/**
 * Injects message channel script to index.html
 */
async function injectMessageChannelScript(ctx: Context) {
  try {
    const bodyString = await getBodyAsString(ctx);
    const reloadInjected = bodyString.replace('</body>', messageChannelScript);
    ctx.body = reloadInjected;
  } catch (error) {
    if (error instanceof RequestCancelledError) {
      return;
    }
    throw error;
  }
}

/**
 * Creates a message channel middleware, which injects a scripts which sets up a
 * server-sent-event connection with the server. This connection can trigger browser
 * reloads or log error messages.
 *
 * @param {MessageChannelMiddlewareConfig} cfg
 */
export function createMessageChannelMiddleware(cfg: MessageChannelMiddlewareConfig): Middleware {
  return async function messageChannelMiddleware(ctx, next) {
    if (ctx.url === messageChannelEndpoint) {
      setupMessageChannel(ctx);
      return;
    }

    await next();

    if (!(await isIndexHTMLResponse(ctx, cfg.appIndex))) {
      return;
    }

    await injectMessageChannelScript(ctx);
  };
}
