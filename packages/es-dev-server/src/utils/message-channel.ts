import { Socket } from 'net';
import { Context } from 'koa';
import { SSEStream } from './utils';

interface Channel {
  stream: SSEStream;
  socket: Socket;
}

const activeChannels = new Set<Channel>();
const pendingErrorMessages = new Map<string, number>();

/**
 * Sends event to all opened browsers.
 */
export function sendMessageToActiveBrowsers(name: string, data?: string) {
  if (name === 'error-message') {
    if (data) {
      pendingErrorMessages.set(data, Date.now());
    }
  }

  activeChannels.forEach(channel => {
    channel.stream.sendMessage(name, data);
  });
}

export function setupMessageChannel(ctx: Context) {
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
