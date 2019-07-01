/* eslint-disable no-restricted-syntax, no-await-in-loop */
import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import { startServer } from '../src/server.js';

const host = 'http://localhost:8080/';

describe('server', () => {
  context('', () => {
    let server;
    beforeEach(() => {
      ({ server } = startServer({
        rootDir: path.resolve(__dirname, 'fixtures', 'simple'),
      }));
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
  });

  it('can configure the hostname', async () => {
    const { server } = startServer({
      rootDir: path.resolve(__dirname, 'fixtures', 'simple'),
      hostname: '0.0.0.0',
    });
    const response = await fetch(`http://0.0.0.0:8080/index.html`);
    const responseText = await response.text();

    expect(response.status).to.equal(200);
    expect(responseText).to.include('<title>My app</title>');
    server.close();
  });

  it('can run multiple servers in parallel', async () => {
    function createServer(port) {
      return startServer({
        rootDir: path.resolve(__dirname, 'fixtures', 'simple'),
        hostname: '0.0.0.0',
        port,
      }).server;
    }

    const servers = [8080, 8081, 8082, 8083, 8084, 8085].map(createServer);
    const requests = servers.map((server, i) => fetch(`http://0.0.0.0:808${i}/index.html`));

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
    const { server } = startServer({
      rootDir: path.resolve(__dirname, 'fixtures', 'simple'),
      hostname: '0.0.0.0',
      customMiddlewares: [
        function customMiddleware(ctx, next) {
          requestURL = ctx.url;
          return next();
        },
      ],
    });
    const response = await fetch(`http://0.0.0.0:8080/index.html`);
    const responseText = await response.text();

    expect(requestURL).to.equal('/index.html');
    expect(response.status).to.equal(200);
    expect(responseText).to.include('<title>My app</title>');
    server.close();
  });
});
