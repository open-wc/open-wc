import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import { startServer, createConfig, compatibilityModes } from '../../src/es-dev-server';

const host = 'http://localhost:8080/';

describe('base path middleware', () => {
  let server;
  beforeEach(async () => {
    ({ server } = await startServer(
      createConfig({
        port: 8080,
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
        appIndex: path.resolve(__dirname, '..', 'fixtures', 'simple', 'index.html'),
        basePath: '/foo',
        compatibility: compatibilityModes.NONE,
      }),
    ));
  });

  afterEach(() => {
    server.close();
  });

  it('strips the base path from requests', async () => {
    const response = await fetch(`${host}foo/index.html`);
    const responseText = await response.text();

    expect(response.status).to.equal(200);
    expect(responseText).to.include('<title>My app</title>');
  });

  it('can request without base path', async () => {
    const response = await fetch(`${host}index.html`);
    const responseText = await response.text();

    expect(response.status).to.equal(200);
    expect(responseText).to.include('<title>My app</title>');
  });
});
