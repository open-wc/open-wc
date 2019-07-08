import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import { startServer } from '../../src/server.js';
import { compatibilityModes } from '../../src/constants.js';
import systemJsLegacyResolveScript from '../../src/browser-scripts/system-js-legacy-resolve';

const REGEXP_ESM_SHIMS = /<script src="polyfills\/es-module-shims.*<\/script>/;
const STRING_IMPORTMAP = '<script type="importmap">';
const STRING_IMPORTMAP_SHIM = '<script type="importmap-shim">';
const STRING_SYSTEMJS_SHIM = '<script type="systemjs-importmap">';
const STRING_IMPORT_SHIM = "window.importShim('./app.js')";
const REGEXP_LOAD_SCRIPT = /loadScript\('polyfills\/webcomponents.*.js'\)/;

const host = 'http://localhost:8080/';

describe('compatibility middleware', () => {
  describe('simple fixture', () => {
    describe('MODERN compatibility mode', () => {
      let server;
      let responseText;

      beforeEach(async () => {
        ({ server } = startServer({
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          compatibilityMode: compatibilityModes.MODERN,
        }));

        const response = await fetch(`${host}index.html`);
        expect(response.status).to.equal(200);
        responseText = await response.text();
      });

      afterEach(() => {
        server.close();
      });

      it('injects an es-module-shims script', async () => {
        expect(responseText.match(REGEXP_ESM_SHIMS).length).to.equal(1);
      });

      it('injects an importShim loader', async () => {
        expect(responseText).to.include(STRING_IMPORT_SHIM);
      });

      it('injects web component polyfills', () => {
        expect(responseText.match(REGEXP_LOAD_SCRIPT).length).to.equal(1);
      });
    });

    describe('ALL compatibility mode', () => {
      let server;
      let responseText;

      beforeEach(async () => {
        ({ server } = startServer({
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          compatibilityMode: compatibilityModes.ALL,
        }));

        const response = await fetch(`${host}index.html`);
        expect(response.status).to.equal(200);
        responseText = await response.text();
      });

      afterEach(() => {
        server.close();
      });

      it('injects an es-module-shims script', async () => {
        expect(responseText.match(REGEXP_ESM_SHIMS).length).to.equal(1);
      });

      it('injects an importShim loader', async () => {
        expect(responseText).to.include(STRING_IMPORT_SHIM);
      });

      it('injects web component polyfills', () => {
        expect(responseText.match(REGEXP_LOAD_SCRIPT).length).to.equal(1);
      });

      it('injects a systemjs legacy script', () => {
        expect(responseText).to.include(systemJsLegacyResolveScript);
      });
    });
  });

  describe('import-map fixture', () => {
    describe('MODERN compatibility mode', () => {
      let server;
      let responseText;

      beforeEach(async () => {
        ({ server } = startServer({
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'import-map'),
          compatibilityMode: compatibilityModes.MODERN,
        }));

        const response = await fetch(`${host}index.html`);
        expect(response.status).to.equal(200);
        responseText = await response.text();
      });

      afterEach(() => {
        server.close();
      });

      it('adds importmap-shim', async () => {
        expect(responseText).to.include(STRING_IMPORTMAP_SHIM);
      });

      it('removes importmap', async () => {
        expect(responseText).to.not.include(STRING_IMPORTMAP);
      });
    });

    describe('ALL compatibility mode', () => {
      let server;
      let responseText;

      beforeEach(async () => {
        ({ server } = startServer({
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'import-map'),
          compatibilityMode: compatibilityModes.ALL,
        }));

        const response = await fetch(`${host}index.html`);
        expect(response.status).to.equal(200);
        responseText = await response.text();
      });

      afterEach(() => {
        server.close();
      });

      it('adds importmap-shim', async () => {
        expect(responseText).to.include(STRING_IMPORTMAP_SHIM);
      });

      it('adds systemjs-importmap', async () => {
        expect(responseText).to.include(STRING_SYSTEMJS_SHIM);
      });

      it('removes importmap', async () => {
        expect(responseText).to.not.include(STRING_IMPORTMAP);
      });
    });
  });
});
