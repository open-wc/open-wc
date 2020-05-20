/* eslint-disable no-restricted-syntax, no-await-in-loop */
import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import { createConfig, startServer as originalStartServer } from '../../src/es-dev-server';

const host = 'http://localhost:8080/';

const defaultConfig = {
  port: 8080,
  rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
  compatibility: 'none',
};

function startServer(...plugins) {
  return originalStartServer(
    createConfig({
      ...defaultConfig,
      plugins,
    }),
  );
}

describe('plugin-transform middleware', () => {
  it('can transform a served file', async () => {
    const { server } = await startServer({
      transform(ctx) {
        if (ctx.path === '/text-files/hello-world.txt') {
          return { body: `${ctx.body} injected text` };
        }
      },
    });

    try {
      const response = await fetch(`${host}text-files/hello-world.txt`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.equal('Hello world! injected text');
    } finally {
      server.close();
    }
  });

  it('can transform a served file from a plugin', async () => {
    const { server } = await startServer({
      serve(ctx) {
        if (ctx.path === '/non-existing.js') {
          return { body: 'my non existing file' };
        }
      },

      transform(ctx) {
        if (ctx.path === '/non-existing.js') {
          return { body: `${ctx.body} injected text` };
        }
      },
    });

    try {
      const response = await fetch(`${host}non-existing.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.equal('my non existing file injected text');
    } finally {
      server.close();
    }
  });

  it('multiple plugins can transform a response', async () => {
    const { server } = await startServer(
      {
        transform(ctx) {
          if (ctx.path === '/text-files/hello-world.txt') {
            return { body: `${ctx.body} INJECT_A` };
          }
        },
      },
      {
        transform(ctx) {
          if (ctx.path === '/text-files/hello-world.txt') {
            return { body: `${ctx.body} INJECT_B` };
          }
        },
      },
    );

    try {
      const response = await fetch(`${host}text-files/hello-world.txt`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.equal('Hello world! INJECT_A INJECT_B');
    } finally {
      server.close();
    }
  });

  it('only handles 2xx range requests', async () => {
    const { server } = await startServer({
      transform(ctx) {
        if (ctx.path === '/non-existing.js') {
          return { body: `${ctx.body} injected text` };
        }
      },
    });

    try {
      const response = await fetch(`${host}non-existing.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(404);
      expect(responseText).to.equal('Not Found');
    } finally {
      server.close();
    }
  });

  it('can set headers', async () => {
    const { server } = await startServer({
      transform(ctx) {
        if (ctx.path === '/index.html') {
          return { body: '...', headers: { 'x-foo': 'bar' } };
        }
      },
    });

    try {
      const response = await fetch(`${host}index.html`);

      expect(response.status).to.equal(200);
      expect(response.headers.get('x-foo')).to.equal('bar');
    } finally {
      server.close();
    }
  });

  it('caches response bodies when possible, by default', async () => {
    const { server } = await startServer({
      transform(ctx) {
        if (ctx.path === '/app.js') {
          return { body: `${Date.now()}` };
        }
      },
    });

    try {
      let response = await fetch(`${host}app.js`);
      let timestampOne = await response.text();

      response = await fetch(`${host}app.js`);
      const timestampTwo = await response.text();

      expect(timestampOne).equal(timestampTwo);
    } finally {
      server.close();
    }
  });

  it('allows users to turn off caching of response body', async () => {
    const { server } = await startServer({
      transform(ctx) {
        if (ctx.path === '/app.js') {
          return { body: `${Date.now()}`, disableCache: true };
        }
      },
    });

    try {
      let response = await fetch(`${host}app.js`);
      let timestampOne = await response.text();

      response = await fetch(`${host}app.js`);
      const timestampTwo = await response.text();

      expect(timestampOne).to.not.equal(timestampTwo);
    } finally {
      server.close();
    }
  });
});
