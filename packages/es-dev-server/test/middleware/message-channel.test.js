import { expect } from 'chai';
import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import path from 'path';
import { startServer, createConfig } from '../../src/es-dev-server.js';
import { messageChannelEndpoint } from '../../src/constants.js';
import { AsyncStream, timeout } from '../test-helpers.js';
import { sendMessageToActiveBrowsers } from '../../src/utils/message-channel.js';
import messageChannelScript from '../../src/browser-scripts/message-channel.js';

const host = 'http://localhost:8080/';
const reloadWithHost = `${host}${messageChannelEndpoint.substring(
  1,
  messageChannelEndpoint.length,
)}`;

/**
 * TODO: Tests are currently not working across certain environments/os/node combinations. Need to investigate.
 */
describe.skip('message channel middleware', () => {
  describe('no flags', () => {
    let server;
    beforeEach(async () => {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'reload'),
          appIndex: path.resolve(__dirname, '..', 'fixtures', 'reload', 'index.html'),
        }),
      ));
    });

    afterEach(() => {
      server.close();
    });

    it('does not inject reload script in index', async () => {
      const response = await fetch(`${host}index.html`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.not.include(messageChannelScript);
    });
  });

  describe('watch flag', () => {
    let server;
    beforeEach(async () => {
      ({ server } = await startServer({
        ...createConfig({
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'reload'),
          appIndex: path.resolve(__dirname, '..', 'fixtures', 'reload', 'index.html'),
          watch: true,
        }),
        watchDebounce: 5,
      }));
    });

    afterEach(() => {
      server.close();
    });

    it('injects browser reload script when requesting index.html', async () => {
      const response = await fetch(`${host}index.html`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include(messageChannelScript);
    });

    it('does not inject script in non-index html files 1', async () => {
      const response = await fetch(`${host}not-index.html`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('<title>This is not the index html</title>');
      expect(responseText).to.not.include(messageChannelScript);
    });

    it('does not inject script in non-index html files 2', async () => {
      const response = await fetch(`${host}not-index/index.html`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('<title>This is also not the index html</title>');
      expect(responseText).to.not.include(messageChannelScript);
    });

    it('starts with a channel-opened event', async () => {
      const controller = new AbortController();

      try {
        const response = await fetch(reloadWithHost, { signal: controller.signal });
        const stream = new AsyncStream(response);

        const message1 = await stream.next();
        expect(message1).to.equal('event: channel-opened\ndata: \n\n');

        // wait to ensure to extra messages were sent
        await timeout(100);
        expect(stream.responses.length).to.equal(1);
      } finally {
        controller.abort();
      }
    });

    it('sends messages to an open channel', async () => {
      const controller = new AbortController();

      try {
        const response = await fetch(reloadWithHost, { signal: controller.signal });
        const stream = new AsyncStream(response);

        // skip init message
        await stream.next();

        sendMessageToActiveBrowsers('foo');
        const message2 = await stream.next();
        expect(message2).to.equal('event: foo\ndata: \n\n');

        sendMessageToActiveBrowsers('bar');
        sendMessageToActiveBrowsers('buz');

        const message3 = await stream.next();
        const message4 = await stream.next();

        expect(message3).to.equal('event: bar\ndata: \n\n');
        expect(message4).to.equal('event: buz\ndata: \n\n');

        await timeout(100);
        expect(stream.responses.length).to.equal(4);
      } finally {
        controller.abort();
      }
    });

    it('sends messages with data', async () => {
      const controller = new AbortController();

      try {
        const response = await fetch(reloadWithHost, { signal: controller.signal });
        const stream = new AsyncStream(response);

        // skip init message
        await stream.next();

        sendMessageToActiveBrowsers('foo', 'bar');
        const message2 = await stream.next();
        expect(message2).to.equal('event: foo\ndata: bar\n\n');

        sendMessageToActiveBrowsers('bar', 'hello \n world');

        const message3 = await stream.next();

        expect(message3).to.equal('event: bar\ndata: hello \n world\n\n');

        await timeout(100);
        expect(stream.responses.length).to.equal(3);
      } finally {
        controller.abort();
      }
    });

    it('sends a message to multiple open channels', async () => {
      const controller = new AbortController();

      try {
        const arrayOf3 = Array(3).fill(null);
        const requests = arrayOf3.map(() => fetch(reloadWithHost, { signal: controller.signal }));
        const responses = await Promise.all(requests);
        const streams = responses.map(e => new AsyncStream(e));

        // skip init messages
        await Promise.all(streams.map(e => e.next()));

        sendMessageToActiveBrowsers('foo');

        const messages = await Promise.all(streams.map(e => e.next()));
        messages.forEach(message => {
          expect(message).to.equal('event: foo\ndata: \n\n');
        });

        await timeout(100);
        streams.forEach(stream => {
          expect(stream.responses.length).to.equal(2);
        });
      } finally {
        controller.abort();
      }
    });

    it('does not crash when a message channel closed', async () => {
      const arrayOf3 = Array(3).fill(null);
      const controllers = arrayOf3.map(() => new AbortController());

      try {
        const requests = arrayOf3.map((_, i) =>
          fetch(reloadWithHost, { signal: controllers[i].signal }),
        );
        const responses = await Promise.all(requests);
        const streams = responses.map(e => new AsyncStream(e));

        await Promise.all(streams.map(e => e.next()));
        sendMessageToActiveBrowsers('foo');
        await Promise.all(streams.map(e => e.next()));

        const [closedStream, ...openStreams] = streams;
        controllers[0].abort();

        sendMessageToActiveBrowsers('bar');

        await timeout(100);
        openStreams.forEach(stream => {
          expect(stream.responses.length).to.equal(3);
        });
        expect(closedStream.responses.length).to.equal(2);
      } finally {
        controllers.forEach(controller => {
          controller.abort();
        });
      }
    });
  });
});
