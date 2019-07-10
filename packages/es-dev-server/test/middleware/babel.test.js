import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import { startServer } from '../../src/server.js';
import { compatibilityModes } from '../../src/constants.js';

const host = 'http://localhost:8080/';

describe('babel middleware', () => {
  describe('no flags', () => {
    let server;
    beforeEach(() => {
      ({ server } = startServer({
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
      }));
    });

    afterEach(() => {
      server.close();
    });

    it('babel does not do any transformation', async () => {
      const response = await fetch(`${host}app.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include("import { message } from 'my-module';");
      expect(responseText).to.include('class Foo {');
      expect(responseText).to.include('const bar ');
    });
  });

  describe('node resolve', () => {
    let server;
    beforeEach(() => {
      ({ server } = startServer({
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
        nodeResolve: true,
      }));
    });

    afterEach(() => {
      server.close();
    });

    it('transforms bare imports in js modules in the root directory', async () => {
      const response = await fetch(`${host}app.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include(
        'import { message } from "./node_modules/my-module/index.js";',
      );
      expect(responseText).to.include('import "./src/local-module.js"');
    });

    it('transforms bare imports in js modules in a sub directory', async () => {
      const response = await fetch(`${host}src/local-module.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include(
        'import { message } from "../node_modules/my-module/index.js";',
      );
    });

    it('adds inline source maps', async () => {
      const response = await fetch(`${host}app.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include(
        '//# sourceMappingURL=data:application/json;charset=utf-8;base64,',
      );
    });

    it('does not transform any syntax', async () => {
      const response = await fetch(`${host}app.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include('class Foo {');
      expect(responseText).to.include('const bar ');
    });

    it('does not transform non-es-module syntax', async () => {
      const response = await fetch(`${host}src/cjs-module.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include("const foo = require('bar');");
      expect(responseText).to.include('module.exports = loremIpsum;');
    });
  });

  describe('readUserBabelConfig flag', () => {
    it('transforms code based on .babelrc from the user', async () => {
      const { server } = startServer({
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
        readUserBabelConfig: true,
      });
      const response = await fetch(`${host}app.js`);
      const responseText = await response.text();
      expect(response.status).to.equal(200);
      expect(responseText).to.include(
        'function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }',
      );
      expect(responseText).to.include('var Foo = function Foo() {');
      expect(responseText).to.include("var bar = 'buz';");

      server.close();
    });

    it('can handle any file extensions', async () => {
      const { server } = startServer({
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
        extraFileExtensions: ['.html', '.foo'],
        readUserBabelConfig: true,
      });

      try {
        const responseHtml = await fetch(`${host}src/fake-module.html`);
        const responseFoo = await fetch(`${host}src/fake-module.foo`);
        const responseTextHtml = await responseHtml.text();
        const responseTextFoo = await responseFoo.text();

        expect(responseHtml.status).to.equal(200);
        expect(responseFoo.status).to.equal(200);
        expect(responseTextHtml).to.include("var foo = 'bar';");
        expect(responseTextFoo).to.include("var bar = 'foo';");
      } finally {
        server.close();
      }
    });
  });

  describe('compatibilityMode modern', () => {
    let server;
    beforeEach(() => {
      ({ server } = startServer({
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
        appIndex: path.resolve(__dirname, '..', 'fixtures', 'simple', 'index.html'),
        compatibilityMode: compatibilityModes.MODERN,
      }));
    });

    afterEach(() => {
      server.close();
    });

    // this test will need to be updated along with browser support :)
    it('transforms 2018+', async () => {
      const response = await fetch(`${host}app.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);

      expect(responseText).to.include('_asyncGenerator = _wrapAsyncGenerator(function* () {');
    });

    it('does not transform es2015', async () => {
      const response = await fetch(`${host}app.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);

      expect(responseText).to.include('class Foo {}');
      expect(responseText).to.include("const bar = 'buz';");
    });

    it('does not transform non-es-module syntax', async () => {
      const response = await fetch(`${host}src/cjs-module.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include("const foo = require('bar');");
      expect(responseText).to.include('module.exports = loremIpsum;');
    });
  });

  describe('compatibilityMode all', () => {
    let server;
    beforeEach(() => {
      ({ server } = startServer({
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
        appIndex: path.resolve(__dirname, '..', 'fixtures', 'simple', 'index.html'),
        compatibilityMode: compatibilityModes.ALL,
      }));
    });

    afterEach(() => {
      server.close();
    });

    describe('regular requests', () => {
      // this test will need to be updated along with browser support :)
      it('for regular requests: transforms 2018+', async () => {
        const response = await fetch(`${host}app.js`);
        const responseText = await response.text();

        expect(response.status).to.equal(200);

        expect(responseText).to.include('_asyncGenerator = _wrapAsyncGenerator(function* () {');
      });

      it('for regular requests: does not transform es2015', async () => {
        const response = await fetch(`${host}app.js`);
        const responseText = await response.text();

        expect(response.status).to.equal(200);

        expect(responseText).to.include('class Foo {}');
        expect(responseText).to.include("const bar = 'buz';");
      });

      it('does not transform non-es-module syntax', async () => {
        const response = await fetch(`${host}src/cjs-module.js`);
        const responseText = await response.text();

        expect(response.status).to.equal(200);
        expect(responseText).to.include("const foo = require('bar');");
        expect(responseText).to.include('module.exports = loremIpsum;');
      });
    });

    describe('requests with ?legacy=true suffixed', () => {
      it('transforms es2018 syntax', async () => {
        const response = await fetch(`${host}app.js?legacy=true`);
        const responseText = await response.text();

        expect(response.status).to.equal(200);

        expect(responseText).to.include('_asyncGenerator = _wrapAsyncGenerator(');
        expect(responseText).to.include('regeneratorRuntime.mark(function _callee() {');
      });

      it('tranforms es2015 syntax', async () => {
        const response = await fetch(`${host}app.js?legacy=true`);
        const responseText = await response.text();

        expect(response.status).to.equal(200);
        expect(responseText).to.include(
          'function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }',
        );
        expect(responseText).to.include('Foo = function Foo() {');
      });

      it('transforms module syntax to SystemJS', async () => {
        const response = await fetch(`${host}app.js?legacy=true`);
        const responseText = await response.text();

        expect(response.status).to.equal(200);
        expect(responseText).to.include(
          'System.register(["my-module", "./src/local-module.js"], function',
        );
      });
    });
  });

  describe('custom babel config', () => {
    let server;
    beforeEach(() => {
      ({ server } = startServer({
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
        appIndex: path.resolve(__dirname, '..', 'fixtures', 'simple', 'index.html'),
        customBabelConfig: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: ['ie 11'],
                useBuiltIns: false,
              },
            ],
          ],
        },
      }));
    });

    afterEach(() => {
      server.close();
    });

    it('uses the babel config', async () => {
      const response = await fetch(`${host}app.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include(
        'function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }',
      );
      expect(responseText).to.include('Foo = function Foo() {');
    });
  });

  describe('typescript', () => {
    let server;
    beforeEach(() => {
      ({ server } = startServer({
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'typescript'),
        appIndex: path.resolve(__dirname, '..', 'fixtures', 'typescript', 'index.html'),
        readUserBabelConfig: true,
        nodeResolve: true,
        extraFileExtensions: ['.ts'],
      }));
    });

    afterEach(() => {
      server.close();
    });

    it('can handle a typescript setup', async () => {
      const response = await fetch(`${host}app.ts`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include(
        'import { message } from "./node_modules/my-module/index.ts";',
      );
      expect(responseText).to.include('import "./src/local-module.ts";');
      expect(responseText).to.include("const bar = 'buz';");
    });
  });
});
