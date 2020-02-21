import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import { startServer, createConfig, compatibilityModes } from '../../src/es-dev-server.js';

const host = 'http://localhost:8080/';

describe('history api fallback middleware', () => {
  describe('index in root', () => {
    let server;
    beforeEach(async () => {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          appIndex: path.resolve(__dirname, '..', 'fixtures', 'simple', 'index.html'),
          compatibility: compatibilityModes.NONE,
        }),
      ));
    });

    afterEach(() => {
      server.close();
    });

    it('returns the regular index.html', async () => {
      const response = await fetch(`${host}index.html`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('<title>My app</title>');
    });

    it('returns the fallback index.html for non-file requests', async () => {
      const response = await fetch(`${host}foo`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('<title>My app</title>');
    });

    it('returns the fallback index.html for file requests with multiple segments', async () => {
      const response = await fetch(`${host}foo/bar/baz`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('<title>My app</title>');
    });

    it('does not return index.html for file requests', async () => {
      const response = await fetch(`${host}text-files/hello-world.txt`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('Hello world!');
      expect(responseText).to.not.include('<title>My app</title>');
    });

    it('does return index.html for requests that have url parameters with . characters (issue 1059)', async () => {
      const response = await fetch(`${host}text-files/foo/bar/?baz=open.wc`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('<title>My app</title>');
    });
  });

  describe('index not in root', () => {
    let server;
    beforeEach(async () => {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'index-not-in-root'),
          appIndex: path.resolve(
            __dirname,
            '..',
            'fixtures',
            'index-not-in-root',
            'src',
            'index.html',
          ),
        }),
      ));
    });

    afterEach(() => {
      server.close();
    });

    it('returns the regular index.html', async () => {
      const response = await fetch(`${host}src/index.html`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('<title>My app</title>');
    });

    it('returns the fallback index.html for non-file requests', async () => {
      const response = await fetch(`${host}src/foo`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('<title>My app</title>');
    });

    it('returns the fallback index.html for file requests with multiple segments', async () => {
      const response = await fetch(`${host}src/foo/bar/baz`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('<title>My app</title>');
    });

    it('does not return the index.html for requests outside the index root', async () => {
      const response = await fetch(`${host}foo`);
      const responseText = await response.text();

      expect(response.status).to.equal(404);
      expect(responseText).to.not.include('<title>My app</title>');
    });

    it('does return index.html for requests that have url parameters with . characters (issue 1059)', async () => {
      const response = await fetch(`${host}src/foo/bar/?baz=open.wc`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('<title>My app</title>');
    });
  });
});
