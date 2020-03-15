import { expect } from 'chai';
import fetch from 'node-fetch';
import path from 'path';
import { startServer, createConfig } from '../../src/es-dev-server.js';
import { compatibilityModes, virtualFilePrefix } from '../../src/constants.js';
import { userAgents } from '../user-agents.js';

const host = 'http://localhost:8080/';

async function setupServer(compatibility) {
  const { server } = await startServer(
    createConfig({
      port: 8080,
      compatibility,
      rootDir: path.resolve(__dirname, '..', '..', 'demo', 'syntax'),
    }),
  );
  return server;
}

async function fetchText(url, userAgent) {
  const response = await fetch(`${host}${url}`, {
    headers: { 'user-agent': userAgent },
  });

  if (response.status !== 200) {
    console.log(response);
    throw new Error('Server did not respond with 200');
  }

  return response.text();
}

async function expectCompatibilityTransform(userAgent, features = {}) {
  const stage4Features = await fetchText(
    `stage-4-features.js${features.esModules ? '?transform-systemjs' : ''}`,
    userAgent,
  );
  const esModules = await fetchText(
    `module-features.js${features.esModules ? '?transform-systemjs' : ''}`,
    userAgent,
  );

  expect(stage4Features).to.include(
    features.objectSpread ? '_objectSpread({}, foo);' : 'bar = { ...foo',
  );
  expect(stage4Features).to.include(
    features.asyncFunction ? '_asyncFunction = _asyncToGenerator(' : 'async function',
  );
  expect(stage4Features).to.include(features.exponentiation ? 'Math.pow(2, 4)' : '2 ** 4');
  expect(stage4Features).to.include(features.classes ? 'Foo = function Foo() {' : 'class Foo {');
  expect(stage4Features).to.include(
    /* eslint-disable-next-line no-template-curly-in-string */
    features.templateLiteral ? '"template ".concat(\'literal\')' : "template ${'literal'}",
  );

  expect(esModules).to.include(
    features.esModules
      ? 'System.register(["lit-html", "./module-features-a.js"]'
      : "import module from './module-features-a.js';",
  );
  expect(esModules).to.include("import('./module-features-b.js')");
  expect(esModules).to.include(features.esModules ? 'meta.url.indexOf' : 'import.meta.url.indexOf');

  expect(stage4Features).to.include(
    features.optionalChaining
      ? "lorem == null ? void 0 : lorem.ipsum) === 'lorem ipsum' && (lorem == null ? void 0 : (_lorem$ipsum = lorem.ipsum) == null ? void 0 : _lorem$ipsum.foo) === undefined;"
      : 'lorem?.ipsum?.foo',
  );

  expect(stage4Features).to.include(
    features.nullishCoalescing
      ? "(buz != null ? buz : 'nullish colaesced') === 'nullish colaesced'"
      : "buz ?? 'nullish colaesced'",
  );
}

async function expectSupportStage3(userAgent) {
  const classFields = await fetchText('stage-3-class-fields.js', userAgent);
  const privateFields = await fetchText('stage-3-private-class-fields.js', userAgent);

  expect(classFields).to.include("myField = 'foo';");
  expect(privateFields).to.include("#foo = 'bar';");
}

describe('compatibility transform middleware', () => {
  describe('compatibilityMode NONE', () => {
    let server;
    beforeEach(async () => {
      server = await setupServer(compatibilityModes.NONE);
    });

    afterEach(() => {
      server.close();
    });

    it('does not do any transformation for standard features', async () => {
      await expectCompatibilityTransform(userAgents['Chrome 78']);
    });

    it('does not do any transformation for stage 3 features', async () => {
      await expectSupportStage3(userAgents['Chrome 78']);
    });
  });

  describe('compatibilityMode MIN', () => {
    let server;
    beforeEach(async () => {
      server = await setupServer(compatibilityModes.MIN);
    });

    afterEach(() => {
      server.close();
    });

    /** NOTE: this test can fail over time as browser support improves */
    it('does not do any transformation for standard features', async () => {
      await expectCompatibilityTransform(userAgents['Chrome 78'], {
        objectSpread: false,
        templateLiteral: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    /** NOTE: this test can fail over time as browser support improves */
    it('does not crash and does not transform stage 3 features', async () => {
      await expectSupportStage3(userAgents['Chrome 78']);
    });
  });

  describe('compatibilityMode MAX', () => {
    let server;
    beforeEach(async () => {
      server = await setupServer(compatibilityModes.MAX);
    });

    afterEach(() => {
      server.close();
    });

    it('transforms for compatibility with all browsers', async () => {
      await expectCompatibilityTransform(userAgents['Chrome 78'], {
        objectSpread: true,
        exponentiation: true,
        asyncFunction: true,
        classes: true,
        templateLiteral: true,
        esModules: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });
  });

  describe('compatibilityMode AUTO', () => {
    let server;
    beforeEach(async () => {
      server = await setupServer(compatibilityModes.AUTO);
    });

    afterEach(() => {
      server.close();
    });

    it('transforms for Chrome 78', async () => {
      await expectCompatibilityTransform(userAgents['Chrome 78'], {
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Chrome 62', async () => {
      await expectCompatibilityTransform(userAgents['Chrome 62'], {
        esModules: true,
        templateLiteral: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Chrome 63', async () => {
      await expectCompatibilityTransform(userAgents['Chrome 63'], {
        esModules: true,
        templateLiteral: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Chrome 64', async () => {
      await expectCompatibilityTransform(userAgents['Chrome 64'], {
        esModules: true,
        templateLiteral: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Firefox 70', async () => {
      await expectCompatibilityTransform(userAgents['Firefox 70'], {
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Safari 12.1.2', async () => {
      await expectCompatibilityTransform(userAgents['Safari 12.1.2'], {
        templateLiteral: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Safari 10', async () => {
      await expectCompatibilityTransform(userAgents['Safari 10'], {
        objectSpread: true,
        exponentiation: true,
        templateLiteral: true,
        asyncFunction: true,
        esModules: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Edge 18', async () => {
      await expectCompatibilityTransform(userAgents['Edge 18'], {
        objectSpread: true,
        esModules: true,
        templateLiteral: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for IE 11', async () => {
      await expectCompatibilityTransform(userAgents['IE 11'], {
        objectSpread: true,
        asyncFunction: true,
        exponentiation: true,
        classes: true,
        templateLiteral: true,
        esModules: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms all for unknown user agent', async () => {
      await expectCompatibilityTransform('unknown user agent', {
        objectSpread: true,
        asyncFunction: true,
        exponentiation: true,
        classes: true,
        templateLiteral: true,
        esModules: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });
  });

  describe('compatibilityMode ALWAYS', () => {
    let server;
    beforeEach(async () => {
      server = await setupServer(compatibilityModes.AUTO);
    });

    afterEach(() => {
      server.close();
    });

    it('transforms for Chrome 78', async () => {
      await expectCompatibilityTransform(userAgents['Chrome 78'], {
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Chrome 62', async () => {
      await expectCompatibilityTransform(userAgents['Chrome 62'], {
        esModules: true,
        templateLiteral: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Chrome 63', async () => {
      await expectCompatibilityTransform(userAgents['Chrome 63'], {
        esModules: true,
        templateLiteral: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Chrome 64', async () => {
      await expectCompatibilityTransform(userAgents['Chrome 64'], {
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Firefox 70', async () => {
      await expectCompatibilityTransform(userAgents['Firefox 70'], {
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Safari 12.1.2', async () => {
      await expectCompatibilityTransform(userAgents['Safari 12.1.2'], {
        templateLiteral: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Safari 10', async () => {
      await expectCompatibilityTransform(userAgents['Safari 10'], {
        objectSpread: true,
        exponentiation: true,
        templateLiteral: true,
        asyncFunction: true,
        esModules: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for Edge 18', async () => {
      await expectCompatibilityTransform(userAgents['Edge 18'], {
        objectSpread: true,
        esModules: true,
        templateLiteral: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms for IE 11', async () => {
      await expectCompatibilityTransform(userAgents['IE 11'], {
        objectSpread: true,
        asyncFunction: true,
        exponentiation: true,
        classes: true,
        templateLiteral: true,
        esModules: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });

    it('transforms all for unknown user agent', async () => {
      await expectCompatibilityTransform('unknown user agent', {
        objectSpread: true,
        asyncFunction: true,
        exponentiation: true,
        classes: true,
        templateLiteral: true,
        esModules: true,
        optionalChaining: true,
        nullishCoalescing: true,
      });
    });
  });

  describe('babel flag', () => {
    it('transforms code based on .babelrc from the user', async () => {
      const { server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          babel: true,
        }),
      );

      try {
        const response = await fetch(`${host}app.js`);
        const responseText = await response.text();

        expect(response.status).to.equal(200);
        expect(responseText).to.include('function _classCallCheck(instance, Constructor) {');
        expect(responseText).to.include('Foo = function Foo() {');
        expect(responseText).to.include("bar = 'buz';");
      } finally {
        server.close();
      }
    });

    it('can handle any file extensions', async () => {
      const { server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          fileExtensions: ['.html', '.foo'],
          babel: true,
        }),
      );

      try {
        const responseHtml = await fetch(`${host}src/fake-module.html`);
        const responseFoo = await fetch(`${host}src/fake-module.foo`);
        const responseTextHtml = await responseHtml.text();
        const responseTextFoo = await responseFoo.text();

        expect(responseHtml.status).to.equal(200);
        expect(responseFoo.status).to.equal(200);
        expect(responseTextHtml).to.include("foo = 'bar';");
        expect(responseTextFoo).to.include("bar = 'foo';");
      } finally {
        server.close();
      }
    });
  });

  describe('custom babel config', () => {
    let server;
    beforeEach(async () => {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          appIndex: path.resolve(__dirname, '..', 'fixtures', 'simple', 'index.html'),
          babelConfig: {
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
        }),
      ));
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

  describe('node resolve flag', () => {
    it('transforms module imports', async () => {
      const { server } = await startServer(
        createConfig({
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          port: 8080,
          nodeResolve: true,
        }),
      );

      try {
        const response = await fetch(`${host}app.js`);
        const responseText = await response.text();

        expect(response.status).to.equal(200);
        expect(responseText).to.include(
          "import { message } from './node_modules/my-module/index.js';",
        );
        expect(responseText).to.include('async function* asyncGenerator()');
      } finally {
        server.close();
      }
    });

    it('transforms module imports when compiling to systemjs', async () => {
      const { server } = await startServer(
        createConfig({
          compatibility: compatibilityModes.MAX,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          port: 8080,
          nodeResolve: true,
        }),
      );

      try {
        const response = await fetch(`${host}app.js?transform-systemjs`);
        const responseText = await response.text();
        expect(response.status).to.equal(200);
        expect(responseText).to.include(
          'System.register(["./node_modules/my-module/index.js", "./src/local-module.js"], function',
        );
      } finally {
        server.close();
      }
    });
  });

  describe('typescript', () => {
    let server;
    beforeEach(async () => {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'typescript'),
          appIndex: path.resolve(__dirname, '..', 'fixtures', 'typescript', 'index.html'),
          babel: true,
          nodeResolve: true,
          fileExtensions: ['.ts'],
        }),
      ));
    });

    afterEach(() => {
      server.close();
    });

    it('can handle a typescript setup', async () => {
      const response = await fetch(`${host}app.ts`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include("const bar = 'buz';");
    });
  });

  it('compiles inline scripts', async () => {
    let server;
    try {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.MAX,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'inline-script'),
        }),
      ));

      const indexResponse = await fetch(`${host}index.html`, {
        headers: { accept: 'text/html' },
      });
      expect(indexResponse.status).to.equal(200);
      const inlineModuleResponse = await fetch(
        `${host}${virtualFilePrefix}inline-script-1.js?source=/index.html`,
      );
      expect(inlineModuleResponse.status).to.equal(200);
      const inlineModuleText = await inlineModuleResponse.text();
      expect(inlineModuleText).to.include('function asyncGenerator() {');
    } finally {
      server.close();
    }
  });

  describe('node resolve flag', () => {
    it('transforms module imports', async () => {
      const { server } = await startServer(
        createConfig({
          compatibility: compatibilityModes.NONE,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          port: 8080,
          nodeResolve: true,
        }),
      );

      try {
        const response = await fetch(`${host}app.js`);
        const responseText = await response.text();

        expect(response.status).to.equal(200);
        expect(responseText).to.include(
          "import { message } from './node_modules/my-module/index.js';",
        );
        expect(responseText).to.include('async function* asyncGenerator()');
      } finally {
        server.close();
      }
    });

    it('transforms module imports when compiling to systemjs', async () => {
      const { server } = await startServer(
        createConfig({
          compatibility: compatibilityModes.MAX,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          port: 8080,
          nodeResolve: true,
        }),
      );

      try {
        const response = await fetch(`${host}app.js?transform-systemjs`);
        const responseText = await response.text();
        expect(response.status).to.equal(200);
        expect(responseText).to.include(
          'System.register(["./node_modules/my-module/index.js", "./src/local-module.js"], function',
        );
      } finally {
        server.close();
      }
    });
  });

  describe('combining node resolve and compatibility', () => {
    let server;
    beforeEach(async () => {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          appIndex: path.resolve(__dirname, '..', 'fixtures', 'simple', 'index.html'),
          compatibility: compatibilityModes.MAX,
          nodeResolve: true,
        }),
      ));
    });

    afterEach(() => {
      server.close();
    });

    it('transforms properly', async () => {
      const response = await fetch(`${host}app.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);

      expect(responseText).to.include('function _classCallCheck(instance, Constructor)');
      expect(responseText).to.include(
        "import { message } from './node_modules/my-module/index.js'",
      );
    });
  });

  describe('combining custom babel and compatibility', () => {
    let server;
    beforeEach(async () => {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.MAX,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'typescript'),
          appIndex: path.resolve(__dirname, '..', 'fixtures', 'typescript', 'index.html'),
          babel: true,
          nodeResolve: true,
          fileExtensions: ['.ts'],
        }),
      ));
    });

    afterEach(() => {
      server.close();
    });

    it('transforms properly', async () => {
      const response = await fetch(`${host}app.ts?transform-systemjs`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);

      expect(responseText).to.include(
        'System.register(["./node_modules/my-module/index.ts", "./src/local-module.ts"]',
      );
      expect(responseText).to.include("bar = 'buz';");
    });
  });

  describe('content-type', () => {
    let server;
    beforeEach(async () => {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          compatibility: compatibilityModes.MAX,
          rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
          fileExtensions: ['.html'],
        }),
      ));
    });

    afterEach(() => {
      server.close();
    });

    it('does not transform HTML files requested with content-type text/html', async () => {
      const response = await fetch(`${host}index.html`, {
        headers: { accept: 'text/html' },
      });
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(response.headers.get('content-type')).to.equal('text/html; charset=utf-8');
      expect(responseText.startsWith('<html>')).to.be.true;
    });

    it('does not transform JS files requested with content-type text/html', async () => {
      const response = await fetch(`${host}app.js`, {
        headers: { accept: 'text/html' },
      });
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(response.headers.get('content-type')).to.equal(
        'application/javascript; charset=utf-8',
      );
      expect(responseText.startsWith("import { message } from 'my-module';")).to.be.true;
    });
  });
});
