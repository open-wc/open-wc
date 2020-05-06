/* eslint-disable no-restricted-syntax, no-await-in-loop */
import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import { startServer as originalStartServer, createConfig } from '../../src/es-dev-server';

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

describe('plugin-mime-type middleware', () => {
  it('can set the mime type of a file', async () => {
    const { server } = await startServer({
      resolveMimeType(ctx) {
        if (ctx.path === '/text-files/hello-world.txt') {
          return 'js';
        }
      },
    });

    try {
      const response = await fetch(`${host}text-files/hello-world.txt`);

      expect(response.status).to.equal(200);
      expect(response.headers.get('content-type')).to.include('application/javascript');
    } finally {
      server.close();
    }
  });
});
