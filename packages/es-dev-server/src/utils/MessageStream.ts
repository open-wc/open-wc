import { SSEStream } from './utils';
import { EventEmitter } from 'events';
import { Socket } from 'net';
import { Context } from 'koa';

export class MessageStream extends EventEmitter {
  private __stream = new SSEStream();

  constructor(public referer: string, private __socket: Socket, private __context: Context) {
    super();
  }

  open() {
    this.__socket.setTimeout(0);
    this.__socket.setNoDelay(true);
    this.__socket.setKeepAlive(true);

    this.__context.type = 'text/event-stream; charset=utf-8';
    this.__context.set('Cache-Control', 'no-cache, no-transform');

    if (this.__context.protocol === 'http') {
      // Connection cannot/does not need to be set when on HTTP2
      this.__context.set('Connection', 'keep-alive');
    }

    this.__context.body = this.__stream;

    this.__context.req.setMaxListeners(100);
    this.__context.req.addListener('error', this.close);
    this.__context.req.addListener('close', this.close);
    this.__context.req.addListener('finish', this.close);

    this.__stream.sendMessage('channel-opened');
  }

  sendMessage(name: string, data?: string) {
    this.__stream.sendMessage(name, data);
  }

  close = () => {
    this.__context.req.removeListener('error', this.close);
    this.__context.req.removeListener('close', this.close);
    this.__context.req.removeListener('finish', this.close);
    this.__stream.end();
    this.__socket.end();
    this.emit('closed');
  };
}
