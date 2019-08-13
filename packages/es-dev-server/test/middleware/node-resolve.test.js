import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import { startServer, createConfig } from '../../src/es-dev-server.js';

const host = 'http://localhost:8080/';

describe('node resolve middleware', () => {
  it('transforms module imports', async () => {
    const { server } = await startServer(
      createConfig({
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
        port: 8080,
        nodeResolve: true,
      }),
    );
    const response = await fetch(`${host}app.js`);
    const responseText = await response.text();
    expect(response.status).to.equal(200);
    expect(responseText).to.include("import { message } from './node_modules/my-module/index.js';");

    server.close();
  });
});
