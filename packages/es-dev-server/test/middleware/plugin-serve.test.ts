/* eslint-disable no-restricted-syntax, no-await-in-loop */
import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import { startServer as originalStartServer, createConfig } from '../../src/es-dev-server';
import { Plugin } from '../../src/Plugin';

const host = 'http://localhost:8080/';

const defaultConfig = {
  port: 8080,
  rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
  compatibility: 'none',
};

function startServer(...plugins: Plugin[]) {
  return originalStartServer(
    createConfig({
      ...defaultConfig,
      plugins,
    }),
  );
}

describe('plugin-serve middleware', () => {
  it('can serve non-existing files', async () => {
    const { server } = await startServer({
      serve(ctx) {
        if (ctx.path === '/non-existing.js') {
          return { body: 'serving non-existing.js' };
        }
      },
    });

    try {
      const response = await fetch(`${host}non-existing.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('serving non-existing.js');
    } finally {
      server.close();
    }
  });

  it('the first plugin to serve a file wins', async () => {
    const { server } = await startServer(
      {
        serve(ctx) {
          if (ctx.path === '/non-existing.js') {
            return { body: 'serve a' };
          }
        },
      },
      {
        serve(ctx) {
          if (ctx.path === '/non-existing.js') {
            return { body: 'serve b' };
          }
        },
      },
    );

    try {
      const response = await fetch(`${host}non-existing.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('serve a');
    } finally {
      server.close();
    }
  });

  it('sets a default content type', async () => {
    const { server } = await startServer({
      serve(ctx) {
        if (ctx.path === '/non-existing.js') {
          return { body: 'serving non-existing.js' };
        }
      },
    });

    try {
      const response = await fetch(`${host}non-existing.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('serving non-existing.js');
      expect(response.headers.get('content-type')).to.equal(
        'application/javascript; charset=utf-8',
      );
    } finally {
      server.close();
    }
  });

  it('can set the content type', async () => {
    const { server } = await startServer({
      serve(ctx) {
        if (ctx.path === '/foo.bar') {
          return { body: 'serving non-existing.html', type: 'css' };
        }
      },
    });

    try {
      const response = await fetch(`${host}foo.bar`);
      expect(response.status).to.equal(200);
      expect(response.headers.get('content-type')).to.equal('text/css; charset=utf-8');
    } finally {
      server.close();
    }
  });

  it('can overwrite existing files', async () => {
    const { server } = await startServer({
      serve(ctx) {
        if (ctx.path === '/index.html') {
          return { body: 'overwritten index.html' };
        }
      },
    });

    try {
      const response = await fetch(`${host}index.html`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('overwritten index.html');
    } finally {
      server.close();
    }
  });

  it('can set headers', async () => {
    const { server } = await startServer({
      serve(ctx) {
        if (ctx.path === '/index.html') {
          return { body: '...', headers: { 'x-foo': 'bar' } };
        }
      },
    });

    try {
      const response = await fetch(`${host}index.html`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(response.headers.get('x-foo')).to.equal('bar');
    } finally {
      server.close();
    }
  });
});
