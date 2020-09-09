/** @typedef {import('../src/types').PolyfillsLoaderConfig} PolyfillsLoaderConfig */

const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const { injectPolyfillsLoader } = require('../src/inject-polyfills-loader');
const { noModuleSupportTest, fileTypes } = require('../src/utils');

const updateSnapshots = process.argv.includes('--update-snapshots');

const defaultConfig = {
  modern: { files: [{ type: fileTypes.MODULE, path: 'app.js' }] },
  polyfills: {
    hash: false,
  },
};

/**
 *
 * @param {string} name
 * @param {string} htmlString
 * @param {PolyfillsLoaderConfig} config
 */
async function testSnapshot(name, htmlString, config) {
  const snapshotPath = path.join(__dirname, 'snapshots', 'inject-polyfills-loader', `${name}.html`);
  const result = await injectPolyfillsLoader(htmlString, config);

  if (updateSnapshots) {
    fs.writeFileSync(snapshotPath, result.htmlString, 'utf-8');
  } else {
    const snapshot = fs.readFileSync(snapshotPath, 'utf-8');
    expect(result.htmlString.replace(/\s/g, '')).to.equal(snapshot.replace(/\s/g, ''));
  }
}

describe('inject-polyfills-loader', () => {
  it('injects a polyfills loader script', () => {
    const html = `
      <html>
      <head></head>

      <body>
        <div>Hello world</div>
      </body>
      </html>
    `;

    testSnapshot('no-polyfills-no-legacy', html, defaultConfig);
  });

  it('injects a loader with module and polyfills', () => {
    const html = `
      <div>before</div>
      <script type="module" src="./app.js"></script>
      <div>after</div>
    `;

    testSnapshot('module-and-polyfills', html, {
      ...defaultConfig,
      polyfills: {
        hash: false,
        webcomponents: true,
        fetch: true,
        intersectionObserver: true,
      },
    });
  });

  it('injects a loader with module and legacy', () => {
    const html = `
      <div>before</div>
      <script type="module" src="./app.js"></script>
      <div>after</div>
    `;

    testSnapshot('module-and-legacy', html, {
      ...defaultConfig,
      legacy: [
        {
          test: noModuleSupportTest,
          files: [
            {
              path: 'a.js',
              type: fileTypes.SYSTEMJS,
            },
            {
              path: 'b.js',
              type: fileTypes.SYSTEMJS,
            },
          ],
        },
      ],
    });
  });

  it('injects a loader with module, legacy and polyfills', () => {
    const html = `
      <div>before</div>
      <script type="module" src="./app.js"></script>
      <div>after</div>
    `;

    testSnapshot('module-polyfills-and-legacy', html, {
      ...defaultConfig,
      legacy: [
        {
          test: noModuleSupportTest,
          files: [
            {
              path: 'a.js',
              type: fileTypes.SYSTEMJS,
            },
            {
              path: 'b.js',
              type: fileTypes.SYSTEMJS,
            },
          ],
        },
      ],
      polyfills: {
        hash: false,
        fetch: true,
        intersectionObserver: true,
      },
    });
  });

  it('injects a loader with multiple legacy', () => {
    const html = `
      <div>before</div>
      <script type="module" src="./app.js"></script>
      <div>after</div>
    `;

    testSnapshot('multiple-legacy', html, {
      ...defaultConfig,
      legacy: [
        {
          test: "'foo' in bar",
          files: [
            {
              path: 'a.js',
              type: fileTypes.ES_MODULE_SHIMS,
            },
            {
              path: 'b.js',
              type: fileTypes.ES_MODULE_SHIMS,
            },
          ],
        },
        {
          test: 'window.x',
          files: [
            {
              path: 'a.js',
              type: fileTypes.SYSTEMJS,
            },
            {
              path: 'b.js',
              type: fileTypes.SYSTEMJS,
            },
          ],
        },
      ],
    });
  });

  it('does not polyfill import maps', () => {
    const html = `
      <head>
        <script type="importmap">{ "imports": { "foo": "bar" } }</script>
      </head>
      <div>before</div>
      <script type="module" src="./module-a.js"></script>
      <div>after</div>
    `;

    testSnapshot('no-importmap-polyfill', html, defaultConfig);
  });

  it('polyfills importmaps when main module type is systemjs', () => {
    const html = `
      <head>
        <script type="importmap">{ "imports": { "foo": "bar" } }</script>
      </head>
      <div>before</div>
      <script type="module" src="./module-a.js"></script>
      <div>after</div>
    `;

    testSnapshot('systemjs-polyfill-importmap-modern', html, {
      ...defaultConfig,
      legacy: [
        {
          test: noModuleSupportTest,
          files: [
            {
              path: 'a.js',
              type: fileTypes.SYSTEMJS,
            },
            {
              path: 'b.js',
              type: fileTypes.SYSTEMJS,
            },
          ],
        },
      ],
    });
  });

  it('polyfills importmaps when legacy is systemjs', () => {
    const html = `
      <head>
        <script type="importmap">{ "imports": { "foo": "bar" } }</script>
      </head>
      <div>before</div>
      <script type="module" src="./module-a.js"></script>
      <div>after</div>
    `;

    testSnapshot('systemjs-polyfill-importmap-legacy', html, {
      ...defaultConfig,
      legacy: [
        {
          test: noModuleSupportTest,
          files: [
            {
              path: 'a.js',
              type: fileTypes.SYSTEMJS,
            },
            {
              path: 'b.js',
              type: fileTypes.SYSTEMJS,
            },
          ],
        },
      ],
    });
  });

  it('polyfills importmaps when legacy is es module shims', () => {
    const html = `
      <head>
        <script type="importmap">{ "imports": { "foo": "bar" } }</script>
      </head>
      <div>before</div>
      <script type="module" src="./module-a.js"></script>
      <div>after</div>
    `;

    testSnapshot('es-module-shims-polyfill-importmap', html, {
      ...defaultConfig,
      legacy: [
        {
          test: noModuleSupportTest,
          files: [
            {
              path: 'a.js',
              type: fileTypes.ES_MODULE_SHIMS,
            },
            {
              path: 'b.js',
              type: fileTypes.ES_MODULE_SHIMS,
            },
          ],
        },
      ],
    });
  });
});
