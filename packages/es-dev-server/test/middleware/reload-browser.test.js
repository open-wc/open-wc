import { expect } from 'chai';
import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import path from 'path';
import fs from 'fs';
import { startServer, createConfig } from '../../src/es-dev-server.js';
import { messageChannelEndpoint } from '../../src/constants.js';
import { AsyncStream, timeout } from '../test-helpers.js';

const host = 'http://localhost:8080/';
const reloadWithHost = `${host}${messageChannelEndpoint.substring(
  1,
  messageChannelEndpoint.length,
)}`;
const reloadFile = path.join(__dirname, '..', 'fixtures', 'reload', 'reloading-file.txt');
const reloadNodeModulesFile = path.join(
  __dirname,
  '..',
  'fixtures',
  'reload',
  'node_modules',
  'my-module',
  'reloading-file.txt',
);

function writeReloadFile(message) {
  fs.writeFileSync(reloadFile, `This file will trigger a reload ${message}`, 'utf-8');
}

function writeReloadNodeModulesFile(message) {
  fs.writeFileSync(
    reloadNodeModulesFile,
    `This file will not trigger a reload ${message}`,
    'utf-8',
  );
}

/**
 * TODO: Tests are currently not working across certain environments/os/node combinations. Need to investigate.
 */
describe.skip('reload browser middleware', function describe() {
  this.timeout(60000);
  let server;
  beforeEach(async () => {
    ({ server } = await startServer({
      ...createConfig({
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'reload'),
        watch: true,
      }),
      watchDebounce: 5,
    }));

    writeReloadFile('1');
    writeReloadNodeModulesFile('1');
    await timeout(1000);
  });

  afterEach(() => {
    server.close();

    fs.unlinkSync(reloadFile);
    fs.unlinkSync(reloadNodeModulesFile);
  });

  it('sends a reload event when a previously served file changes', async () => {
    const controller = new AbortController();

    try {
      // fetch a file to start watching it
      const fileResponse = await fetch(`${host}reloading-file.txt`);
      expect(fileResponse.status).to.equal(200);

      const streamResponse = await fetch(reloadWithHost, { signal: controller.signal });
      const asyncStream = new AsyncStream(streamResponse);

      await asyncStream.next();

      writeReloadFile('12');
      const secondResponse = await asyncStream.next();
      writeReloadFile('123');
      const thirdResponse = await asyncStream.next();

      expect(secondResponse).to.equal('event: file-changed\ndata: \n\n');
      expect(thirdResponse).to.equal('event: file-changed\ndata: \n\n');

      await timeout(100);
      expect(asyncStream.responses.length).to.equal(3);
    } finally {
      controller.abort();
    }
  });

  it('debounces reload events', async () => {
    const controller = new AbortController();

    try {
      // fetch a file to start watching it
      const fileResponse = await fetch(`${host}reloading-file.txt`);
      expect(fileResponse.status).to.equal(200);

      const streamResponse = await fetch(reloadWithHost, { signal: controller.signal });
      const asyncStream = new AsyncStream(streamResponse);

      await asyncStream.next();

      writeReloadFile('1234');
      writeReloadFile('12345');
      const secondResponse = await asyncStream.next();

      expect(secondResponse).to.equal('event: file-changed\ndata: \n\n');
      await timeout(100);
      expect(asyncStream.responses.length).to.equal(2);
    } finally {
      controller.abort();
    }
  });

  it('does not send a reload event when a file changed that was not served', async () => {
    const controller = new AbortController();

    try {
      const streamResponse = await fetch(reloadWithHost, { signal: controller.signal });
      const asyncStream = new AsyncStream(streamResponse);

      await asyncStream.next();

      writeReloadFile('123456');

      await timeout(100);
      expect(asyncStream.responses.length).to.equal(1);
    } finally {
      controller.abort();
    }
  });

  it('does not send reload events for ignored files', async () => {
    const controller = new AbortController();

    try {
      // fetch a file to start watching it
      const fileResponse = await fetch(`${host}node_modules/my-module/reloading-file.txt`);
      expect(fileResponse.status).to.equal(200);

      const streamResponse = await fetch(reloadWithHost, { signal: controller.signal });
      const asyncStream = new AsyncStream(streamResponse);

      await asyncStream.next();

      writeReloadNodeModulesFile('12');

      await timeout(100);
      expect(asyncStream.responses.length).to.equal(1);
    } finally {
      controller.abort();
    }
  });
});
