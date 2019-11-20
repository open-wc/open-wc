/**
 * @typedef {object} MessageChannelMiddlewareConfig
 * @property {string} appIndex
 * @property {string} rootDir
 */

import { isIndexHTMLResponse, getBodyAsString, RequestCancelledError } from '../utils/utils.js';
import { setupMessageChannel } from '../utils/message-channel.js';
import { messageChannelEndpoint } from '../constants.js';
import messageChannelScript from '../browser-scripts/message-channel.js';

/**
 * Injects message channel script to index.html
 *
 * @param {import('koa').Context} ctx
 */
async function injectMessageChannelScript(ctx) {
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
export function createMessageChannelMiddleware(cfg) {
  /** @type {import('koa').Middleware} */
  async function messageChannelMiddleware(ctx, next) {
    if (ctx.url === messageChannelEndpoint) {
      setupMessageChannel(ctx);
      return;
    }

    await next();

    if (!(await isIndexHTMLResponse(ctx, cfg.appIndex))) {
      return;
    }

    await injectMessageChannelScript(ctx);
  }

  return messageChannelMiddleware;
}
