/* eslint-disable no-restricted-syntax, no-await-in-loop */
import Koa from 'koa';
import { Server } from 'net';
import { FSWatcher } from 'chokidar';
import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import { startServer, createConfig } from '../src/es-dev-server';

const host = 'http://localhost:8080/';

describe('server', () => {
  context('', () => {
    let server;
    beforeEach(async () => {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          rootDir: path.resolve(__dirname, 'fixtures', 'simple'),
          compress: { threshold: 1 },
        }),
      ));
    });

    afterEach(() => {
      server.close();
    });

    it('returns static files', async () => {
      const response = await fetch(`${host}index.html`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('<title>My app</title>');
    });

    it('returns hidden files', async () => {
      const response = await fetch(`${host}.babelrc.js`);
      expect(response.status).to.equal(200);
    });

    it('returns static files in a nested path', async () => {
      const response = await fetch(`${host}text-files/hello-world.txt`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.equal('Hello world!');
    });

    it('returns a 404 for unknown files', async () => {
      const response = await fetch(`${host}foo.js`);

      expect(response.status).to.equal(404);
    });

    it('sets no-cache header', async () => {
      const response = await fetch(`${host}index.html`);

      expect(response.status).to.equal(200);
      expect(response.headers.get('cache-control')).to.equal('no-cache');
    });

    it('compresses responses by default', async () => {
      const headers = { 'Accept-Encoding': 'gzip' };
      const response = await fetch(`${host}index.html`, { headers });

      expect(response.headers.get('content-encoding')).to.equal('gzip');
    });
  });

  it('can configure the hostname', async () => {
    const { server } = await startServer(
      createConfig({
        rootDir: path.resolve(__dirname, 'fixtures', 'simple'),
        hostname: '0.0.0.0',
        port: 8080,
      }),
    );
    const response = await fetch(`http://0.0.0.0:8080/index.html`);
    const responseText = await response.text();

    expect(response.status).to.equal(200);
    expect(responseText).to.include('<title>My app</title>');
    server.close();
  });

  it('can run multiple servers in parallel', async () => {
    async function createServer(port) {
      return (
        await startServer(
          createConfig({
            port,
            rootDir: path.resolve(__dirname, 'fixtures', 'simple'),
            hostname: '0.0.0.0',
          }),
        )
      ).server;
    }

    const servers = await Promise.all([9080, 9081, 9082, 9083, 9084, 9085].map(createServer));
    const requests = servers.map((server, i) => fetch(`http://0.0.0.0:908${i}/index.html`));

    for (const request of requests) {
      const response = await request;
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('<title>My app</title>');
    }

    servers.forEach(server => {
      server.close();
    });
  });

  it('can install custom middlewares', async () => {
    let requestURL;
    const { server } = await startServer(
      createConfig({
        port: 8080,
        rootDir: path.resolve(__dirname, 'fixtures', 'simple'),
        hostname: '0.0.0.0',
        middlewares: [
          function customMiddleware(ctx, next) {
            requestURL = ctx.url;
            return next();
          },
        ],
      }),
    );
    const response = await fetch(`http://0.0.0.0:8080/index.html`);
    const responseText = await response.text();

    expect(requestURL).to.equal('/index.html');
    expect(response.status).to.equal(200);
    expect(responseText).to.include('<title>My app</title>');
    server.close();
  });

  it('calls the onServerStart', async () => {
    let onStart = false;
    const { server } = await startServer(
      createConfig({
        onServerStart() {
          onStart = true;
        },
      }),
    );

    expect(onStart).to.be.true;
    server.close();
  });

  it('calls server start plugin hook', async () => {
    let startArgs;
    const { server } = await startServer(
      createConfig({
        plugins: [
          {
            serverStart(args) {
              startArgs = args;
            },
          },
        ],
      }),
    );

    expect(startArgs).to.exist;
    expect(startArgs.app).to.be.an.instanceOf(Koa);
    expect(startArgs.server).to.be.an.instanceOf(Server);
    expect(startArgs.fileWatcher).to.be.an.instanceOf(FSWatcher);
    expect(startArgs.config).to.be.an('object');

    server.close();
  });

  it('waits on server start hooks before starting', async () => {
    let aFinished = false;
    let bFinished = false;

    const { server } = await startServer(
      createConfig({
        plugins: [
          {
            serverStart() {
              return new Promise(resolve =>
                setTimeout(() => {
                  aFinished = true;
                  resolve();
                }, 5),
              );
            },
          },
          {
            serverStart() {
              return new Promise(resolve =>
                setTimeout(() => {
                  bFinished = true;
                  resolve();
                }, 10),
              );
            },
          },
        ],
      }),
    );

    expect(aFinished).to.be.true;
    expect(bFinished).to.be.true;
    server.close();
  });
});
