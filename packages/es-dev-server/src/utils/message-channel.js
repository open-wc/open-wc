import { SSEStream } from './utils.js';

/** @type {Set<{ stream: SSEStream, socket:import('net').Socket }>} */
const activeChannels = new Set();
/** @type {Map<string, number>} */
const pendingErrorMessages = new Map();

/**
 * Sends event to all opened browsers.
 *
 * @param {string} name
 * @param {string} [data]
 */
export function sendMessageToActiveBrowsers(name, data) {
  if (name === 'error-message') {
    pendingErrorMessages.set(data, Date.now());
  }

  activeChannels.forEach(channel => {
    channel.stream.sendMessage(name, data);
  });
}

/**
 * @param {import('koa').Context} ctx
 */
export function setupMessageChannel(ctx) {
  const channel = {
    stream: new SSEStream(),
    socket: ctx.req.socket,
  };
  activeChannels.add(channel);

  function close() {
    activeChannels.delete(channel);
    ctx.req.removeListener('error', close);
    ctx.req.removeListener('close', close);
    ctx.req.removeListener('finish', close);
    channel.stream.end();
    channel.socket.end();
  }

  channel.socket.setTimeout(0);
  channel.socket.setNoDelay(true);
  channel.socket.setKeepAlive(true);

  ctx.type = 'text/event-stream; charset=utf-8';
  ctx.set('Cache-Control', 'no-cache, no-transform');

  if (ctx.protocol === 'http') {
    // Connection cannot/does not need to be set when on HTTP2
    ctx.set('Connection', 'keep-alive');
  }

  ctx.body = channel.stream;

  ctx.req.setMaxListeners(100);
  ctx.req.addListener('error', close);
  ctx.req.addListener('close', close);
  ctx.req.addListener('finish', close);

  channel.stream.sendMessage('channel-opened');
  const now = Date.now();

  // send error messages that occurred within 1sec before opening the new
  // message channel. this helps catch errors that happen while loading a
  // page when the message channel is not set up yet
  pendingErrorMessages.forEach((timestamp, message) => {
    if (now - timestamp <= 1000) {
      channel.stream.sendMessage('error-message', message);
    }
  });
  pendingErrorMessages.clear();
}
