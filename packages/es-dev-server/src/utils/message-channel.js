import { SSEStream } from './utils.js';

/** @type {SSEStream | null} */
let activeStream;
/** @type {import ('net').Socket} */
let activeSocket;
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

  if (activeStream) {
    activeStream.sendMessage(name, data);
  }
}

/**
 * @param {import('koa').Context} ctx
 */
export function setupMessageChannel(ctx) {
  if (activeStream && activeSocket) {
    activeStream.end();
    activeSocket.end();

    activeSocket = null;
    activeStream = null;
  }

  const stream = new SSEStream();
  activeStream = stream;
  activeSocket = ctx.req.socket;

  function close() {
    ctx.req.socket.removeListener('error', close);
    ctx.req.socket.removeListener('close', close);
    stream.end();
    ctx.req.socket.end();
    activeStream = null;
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

  ctx.body = activeStream;

  ctx.req.setMaxListeners(100);
  ctx.req.addListener('error', close);
  ctx.req.addListener('close', close);
  ctx.req.addListener('finish', close);

  activeStream.sendMessage('channel-opened');
  const now = Date.now();

  // send error messages that occurred within 1sec before opening the new
  // message channel. this helps catch errors that happen while loading a
  // page when the message channel is not set up yet
  pendingErrorMessages.forEach((timestamp, message) => {
    if (now - timestamp <= 1000) {
      activeStream.sendMessage('error-message', message);
    }
  });
  pendingErrorMessages.clear();
}
