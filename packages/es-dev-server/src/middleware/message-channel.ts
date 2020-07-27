import { Context, Middleware } from 'koa';
import { getBodyAsString, RequestCancelledError } from '../utils/utils';
import { messageChannelEndpoint } from '../constants';
import messageChannelScript from '../browser-scripts/message-channel';
import { MessageChannel } from '../utils/MessageChannel';

interface MessageChannelMiddlewareConfig {
  messageChannel: MessageChannel;
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
      cfg.messageChannel.registerListener(ctx);
      return;
    }

    await next();

    if (!ctx.response.is('html')) {
      return;
    }

    await injectMessageChannelScript(ctx);
  };
}
