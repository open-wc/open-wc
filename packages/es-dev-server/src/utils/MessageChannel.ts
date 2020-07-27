import { Context } from 'koa';
import { MessageStream } from './MessageStream';

export interface MessageArgs {
  name: string;
  data?: string;
  listeners?: string[];
}

export class MessageChannel {
  private __activeChannels = new Set<MessageStream>();
  private __pendingErrorMessages = new Map<string, number>();

  registerListener(context: Context) {
    const { referer }: { referer?: string } = context.headers;
    if (!referer) {
      throw new Error('Cannot set up a message channel without a referer.');
    }
    const messageChannel = new MessageStream(referer, context.socket, context);

    this.__activeChannels.add(messageChannel);
    messageChannel.addListener('closed', () => {
      this.__activeChannels.delete(messageChannel);
    });

    messageChannel.open();

    const now = Date.now();
    // send error messages that occurred within 1sec before opening the new
    // message channel. this helps catch errors that happen while loading a
    // page when the message channel is not set up yet
    this.__pendingErrorMessages.forEach((timestamp, message) => {
      if (now - timestamp <= 1000) {
        messageChannel.sendMessage('error-message', message);
      }
    });
    this.__pendingErrorMessages.clear();
  }

  sendMessage({ name, data, listeners }: MessageArgs) {
    if (name === 'error-message') {
      if (data) {
        this.__pendingErrorMessages.set(data, Date.now());
      }
    }

    for (const channel of this.__activeChannels) {
      if (!listeners || listeners.includes(channel.referer)) {
        channel.sendMessage(name, data);
      }
    }
  }
}
