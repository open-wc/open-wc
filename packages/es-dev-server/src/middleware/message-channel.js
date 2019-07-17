/**
 * @typedef {object} MessageChannelMiddlewareConfig
 * @property {string} appIndex
 * @property {string} rootDir
 */

import { isIndexHTMLResponse, getBodyAsString, SSEStream } from '../utils/utils.js';
import { messageChannelEndpoint } from '../constants.js';
import messageChannelScript from '../browser-scripts/message-channel.js';

/** @type {Set<SSEStream>} */
const channels = new Set();

/**
 * Sends event to all opened browsers.
 *
 * @param {string} name
 * @param {string} [data]
 */
export function sendMessageToActiveBrowsers(name, data) {
  channels.forEach(channel => {
    channel.sendMessage(name, data);
  });
}

/**
 * Injects message channel script to index.html
 *
 * @param {import('koa').Context} ctx
 */
function setupMessageChannel(ctx) {
  const { socket } = ctx;
  const channel = new SSEStream();
  channels.add(channel);

  function close() {
    channels.delete(channel);
    socket.removeListener('error', close);
    socket.removeListener('close', close);
  }

  ctx.req.socket.setTimeout(0);
  ctx.req.socket.setNoDelay(true);
  ctx.req.socket.setKeepAlive(true);

  ctx.type = 'text/event-stream; charset=utf-8';
  ctx.set('Cache-Control', 'no-cache, no-transform');

  if (ctx.protocol === 'http') {
    // Connection cannot/does not need to be set when on HTTP2
    ctx.set('Connection', 'keep-alive');
  }

  ctx.body = channel;

  ctx.req.setMaxListeners(100);
  ctx.req.addListener('error', close);
  ctx.req.addListener('close', close);
  ctx.req.addListener('finish', close);

  channel.sendMessage('channel-opened');
}

/**
 * Injects message channel script to index.html
 *
 * @param {import('koa').Context} ctx
 */
async function injectMessageChannelScript(ctx) {
  const bodyString = await getBodyAsString(ctx);
  const reloadInjected = bodyString.replace('</body>', messageChannelScript);
  ctx.body = reloadInjected;
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
