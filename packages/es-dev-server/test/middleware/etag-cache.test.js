import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import uuid from 'uuid/v4.js';
import { startServer, createConfig, compatibilityModes } from '../../src/es-dev-server.js';
import { createMockFileWatcher, timeout } from '../test-helpers.js';

const host = 'http://localhost:8080/';

const fixtureDir = path.resolve(__dirname, '..', 'fixtures', 'simple');
const testFileAName = 'cached-file-a.js';
const testFileBName = 'cached-file-b.js';
const testFileAPath = path.join(fixtureDir, testFileAName);
const testFileBPath = path.join(fixtureDir, testFileBName);

describe('etag cache middleware', () => {
  let mockFileWatcher;
  let server;

  beforeEach(async () => {
    mockFileWatcher = createMockFileWatcher();
    ({ server } = await startServer(
      createConfig({
        port: 8080,
        rootDir: fixtureDir,
        compatibility: compatibilityModes.NONE,
      }),
      // @ts-ignore
      mockFileWatcher,
    ));
  });

  afterEach(() => {
    server.close();
  });

  context('', () => {
    beforeEach(() => {
      fs.writeFileSync(testFileAPath, '// this file is cached', 'utf-8');
    });

    afterEach(() => {
      fs.unlinkSync(testFileAPath);
    });

    it("returns 304 responses if file hasn't changed", async () => {
      const initialResponse = await fetch(`${host}${testFileAName}`);
      const etag = initialResponse.headers.get('etag');

      expect(initialResponse.status).to.equal(200);
      expect(await initialResponse.text()).to.equal('// this file is cached');

      expect(etag).to.be.a('string');

      const headers = { headers: { 'if-none-match': etag } };
      const cachedResponse = await fetch(`${host}${testFileAName}`, headers);

      expect(cachedResponse.status).to.equal(304);
      expect(await cachedResponse.text()).to.equal('');
    });
  });

  context('', () => {
    beforeEach(() => {
      fs.writeFileSync(testFileBPath, '// this file is cached', 'utf-8');
    });

    afterEach(() => {
      fs.unlinkSync(testFileBPath);
    });

    it('returns 200 responses if file changed', async () => {
      fs.writeFileSync(testFileBPath, '// this file is cached', 'utf-8');

      const initialResponse = await fetch(`${host}${testFileBName}`);
      const etag = initialResponse.headers.get('etag');

      expect(initialResponse.status).to.equal(200);
      expect(await initialResponse.text()).to.equal('// this file is cached');
      expect(etag).to.be.a('string');

      await timeout(1000);
      const fileContent = `// the cache is busted${uuid()}`;
      fs.writeFileSync(testFileBPath, fileContent, 'utf-8');
      mockFileWatcher.dispatchEvent('change', testFileBPath);

      const headers = { headers: { 'if-none-match': etag } };
      const cachedResponse = await fetch(`${host}${testFileBName}`, headers);

      expect(cachedResponse.status).to.equal(200);
      expect(await cachedResponse.text()).to.equal(fileContent);
    });
  });
});
