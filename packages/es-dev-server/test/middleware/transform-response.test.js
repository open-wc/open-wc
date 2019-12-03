import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import { stub } from 'sinon';
import { startServer, createConfig, compatibilityModes } from '../../src/es-dev-server.js';

const host = 'http://localhost:8080/';

describe('transform response middleware', () => {
  it('has no effect when no transforms are set', async () => {
    let server;

    try {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
        }),
      ));
      const response = await fetch(`${host}text-files/hello-world.txt`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.equal('Hello world!');
    } finally {
      server.close();
    }
  });

  it('passes args to the transformer and returns the new response', async () => {
    let server;
    try {
      const transformer = stub().returns({ body: 'transformed response' });
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          responseTransformers: [transformer],
        }),
      ));
      const response = await fetch(`${host}text-files/hello-world.txt`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.equal('transformed response');
      expect(transformer.callCount).to.equal(1);
      expect(transformer.getCall(0).args).to.eql([
        {
          status: 200,
          url: '/text-files/hello-world.txt',
          contentType: 'text/plain; charset=utf-8',
          body: 'Hello world!',
        },
      ]);
    } finally {
      server.close();
    }
  });

  it('can change only the content-type', async () => {
    let server;
    try {
      const transformer = stub().returns({
        body: 'transformed response',
        contentType: 'application/javascript',
      });
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          responseTransformers: [transformer],
        }),
      ));
      const response = await fetch(`${host}text-files/hello-world.txt`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(response.headers.get('content-type')).to.equal('application/javascript');
      expect(responseText).to.equal('transformed response');
    } finally {
      server.close();
    }
  });

  it('can change both the content type and body', async () => {
    let server;
    try {
      const transformer = stub().returns({
        contentType: 'application/javascript',
      });
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          responseTransformers: [transformer],
        }),
      ));
      const response = await fetch(`${host}text-files/hello-world.txt`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(response.headers.get('content-type')).to.equal('application/javascript');
      expect(responseText).to.equal('Hello world!');
    } finally {
      server.close();
    }
  });

  it('transforms can be async', async () => {
    let server;
    try {
      const transformer = stub().returns(Promise.resolve({ body: 'transformed response' }));
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          responseTransformers: [transformer],
        }),
      ));
      const response = await fetch(`${host}text-files/hello-world.txt`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.equal('transformed response');
      expect(transformer.callCount).to.equal(1);
      expect(transformer.getCall(0).args).to.eql([
        {
          status: 200,
          url: '/text-files/hello-world.txt',
          contentType: 'text/plain; charset=utf-8',
          body: 'Hello world!',
        },
      ]);
    } finally {
      server.close();
    }
  });

  it('returns the original response when a transformer returns null', async () => {
    let server;
    try {
      const transformer = stub().returns(null);
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          responseTransformers: [transformer],
        }),
      ));
      const response = await fetch(`${host}text-files/hello-world.txt`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.equal('Hello world!');
      expect(transformer.callCount).to.equal(1);
    } finally {
      server.close();
    }
  });

  it('calls multiple transformer in order, passing along the result', async () => {
    let server;
    try {
      const transformer1 = stub().returns({ body: 'transform 1' });
      const transformer2 = stub().returns(null);
      const transformer3 = stub().returns({ body: 'transform 2' });
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          responseTransformers: [transformer1, transformer2, transformer3],
        }),
      ));
      const response = await fetch(`${host}text-files/hello-world.txt`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.equal('transform 2');
      expect(transformer1.callCount).to.equal(1);
      expect(transformer2.callCount).to.equal(1);
      expect(transformer3.callCount).to.equal(1);
      expect(transformer1.getCall(0).args[0].body).to.equal('Hello world!');
      expect(transformer2.getCall(0).args[0].body).to.equal('transform 1');
      expect(transformer3.getCall(0).args[0].body).to.equal('transform 1');
    } finally {
      server.close();
    }
  });

  it('can serve a virtal file', async () => {
    let server;

    try {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          responseTransformers: [
            () => ({
              body: 'this is a virtual file',
            }),
          ],
        }),
      ));
      const response = await fetch(`${host}non-existing.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.equal('this is a virtual file');
    } finally {
      server.close();
    }
  });
});
