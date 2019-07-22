import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import { startServer, createConfig } from '../../src/es-dev-server.js';

const host = 'http://localhost:8080/';

const fixtureDir = path.resolve(__dirname, '..', 'fixtures', 'simple');
const testFile = path.join(fixtureDir, 'cached-files.js');

describe('cache middleware', () => {
  let server;
  beforeEach(() => {
    ({ server } = startServer(
      createConfig({
        rootDir: fixtureDir,
      }),
    ));

    fs.writeFileSync(testFile, 'this file is cached', 'utf-8');
  });

  afterEach(() => {
    server.close();
    fs.unlinkSync(testFile);
  });

  it("returns 304 responses if file hasn't changed", async () => {
    const initialResponse = await fetch(`${host}cached-files.js`);
    const etag = initialResponse.headers.get('etag');

    expect(initialResponse.status).to.equal(200);
    expect(await initialResponse.text()).to.equal('this file is cached');

    expect(etag).to.be.a('string');

    const headers = { headers: { 'if-none-match': etag } };
    const cachedResponse = await fetch(`${host}cached-files.js`, headers);

    expect(cachedResponse.status).to.equal(304);
    expect(await cachedResponse.text()).to.equal('');
  });

  it('returns 200 responses if file changed', async () => {
    const initialResponse = await fetch(`${host}cached-files.js`);
    const etag = initialResponse.headers.get('etag');

    expect(initialResponse.status).to.equal(200);
    expect(await initialResponse.text()).to.equal('this file is cached');
    expect(etag).to.be.a('string');

    // file system is second-specific, so we need to wait 1sec
    fs.writeFileSync(testFile, `the cache is busted${Math.random()}`, 'utf-8');
    await new Promise(resolve => setTimeout(resolve, 1500));

    const headers = { headers: { 'if-none-match': etag } };
    const cachedResponse = await fetch(`${host}cached-files.js`, headers);

    expect(cachedResponse.status).to.equal(200);
    expect((await cachedResponse.text()).startsWith('the cache is busted')).to.equal(true);
  });
});
