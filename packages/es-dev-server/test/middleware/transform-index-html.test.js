import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import { startServer } from '../../src/server.js';
import { compatibilityModes } from '../../src/constants.js';

const update = process.argv.includes('--update-snapshots');
const host = 'http://localhost:8080/';

const fixtures = ['simple', 'inline-module', 'import-map'];
const snapshotsDir = path.join(__dirname, '..', 'snapshots', 'transform-index-html');

describe('transform-index-html middleware', () => {
  fixtures.forEach(fixture => {
    Object.values(compatibilityModes).forEach(compatibilityMode => {
      // inline-module + compat mode none doesn't trigger transform without running babel
      const extraOptionsArray =
        fixture === 'inline-module' && compatibilityMode === compatibilityModes.NONE
          ? [null, { nodeResolve: true }]
          : [null];

      extraOptionsArray.forEach(extraOptions => {
        const name = `${fixture}-${compatibilityMode}${extraOptions ? '-babel' : ''}`;
        it(`${name} matches the snapshot`, async () => {
          let server;
          try {
            ({ server } = startServer({
              rootDir: path.resolve(__dirname, '..', 'fixtures', fixture),
              compatibilityMode,
              ...extraOptions,
            }));

            const response = await fetch(`${host}index.html`);
            expect(response.status).to.equal(200);
            const responseText = await response.text();
            const filePath = path.join(snapshotsDir, `${name}.html`);

            if (update) {
              fs.writeFileSync(filePath, responseText);
            } else {
              if (!fs.existsSync(filePath)) {
                throw new Error(`No snapshot found for ${name}`);
              }

              expect(fs.readFileSync(filePath, 'utf-8').replace(/\s/, '')).to.equal(
                responseText.replace(/\s/, ''),
              );
            }
          } finally {
            server.close();
          }
        });
      });
    });
  });

  it('serves polyfills', async () => {
    let server;
    try {
      ({ server } = startServer({
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'inline-module'),
        compatibilityMode: compatibilityModes.ALL,
      }));

      const indexResponse = await fetch(`${host}index.html`);
      expect(indexResponse.status).to.equal(200);
      const fetchPolyfillPath = /polyfills\/fetch\..+\.js/.exec(await indexResponse.text())[0];
      const fetchPolyfillResponse = await fetch(`${host}${fetchPolyfillPath}`);
      expect(fetchPolyfillResponse.status).to.equal(200);
      expect(fetchPolyfillResponse.headers.get('content-type')).to.equal('text/javascript');
      expect(fetchPolyfillResponse.headers.get('cache-control')).to.equal(
        'public, max-age=31536000',
      );
      expect((await fetchPolyfillResponse.text()).length).to.not.equal(0);
    } finally {
      server.close();
    }
  });

  it('serves inline modules', async () => {
    let server;
    try {
      ({ server } = startServer({
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'inline-module'),
        compatibilityMode: compatibilityModes.ESM,
      }));

      const indexResponse = await fetch(`${host}index.html`);
      expect(indexResponse.status).to.equal(200);
      const inlineModule0Response = await fetch(`${host}inline-module-0.js?source=/index.html`);
      expect(inlineModule0Response.status).to.equal(200);
      expect(inlineModule0Response.headers.get('content-type')).to.equal('text/javascript');
      expect(inlineModule0Response.headers.get('cache-control')).to.equal('no-cache');
      expect(await inlineModule0Response.text()).to.include("import './src/local-module.js';");

      const inlineModule1Response = await fetch(`${host}inline-module-1.js?source=/index.html`);
      expect(inlineModule1Response.status).to.equal(200);
      expect(inlineModule1Response.headers.get('content-type')).to.equal('text/javascript');
      expect(inlineModule1Response.headers.get('cache-control')).to.equal('no-cache');
      expect(await inlineModule1Response.text()).to.include("console.log('hello world')");
    } finally {
      server.close();
    }
  });
});
