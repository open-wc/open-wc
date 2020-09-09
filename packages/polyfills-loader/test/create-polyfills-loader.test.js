/** @typedef {import('../src/types').PolyfillsLoaderConfig} PolyfillsLoaderConfig  */

const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { createPolyfillsLoader } = require('../index');
const { noModuleSupportTest, fileTypes } = require('../src/utils');

const updateSnapshots = process.argv.includes('--update-snapshots');

/**
 * @param {{ name: string, config: PolyfillsLoaderConfig, expectedFiles?: string[] }} param0
 */
async function testSnapshot({ name, config, expectedFiles = /** @type {string[]} */ ([]) }) {
  const snapshotPath = path.join(__dirname, 'snapshots', 'create-polyfills-loader', `${name}.js`);
  const loader = await createPolyfillsLoader(config);
  if (!loader) {
    throw new Error('No loader was generated');
  }

  expect(loader.polyfillFiles.map(f => f.path)).to.eql(expectedFiles);

  if (updateSnapshots) {
    fs.writeFileSync(snapshotPath, loader.code, 'utf-8');
  } else {
    const snapshot = fs.readFileSync(snapshotPath, 'utf-8');
    expect(loader.code.replace(/\s/g, '')).to.equal(snapshot.replace(/\s/g, ''));
  }
}

describe('create-polyfills-loader', function describe() {
  // bootup of the first test can take a long time in CI to load all the polyfills
  this.timeout(5000);

  it('generates a loader script with one module resource', () => {
    testSnapshot({
      name: 'module-resource',
      config: {
        modern: { files: [{ type: fileTypes.MODULE, path: 'app.js' }] },
        polyfills: {
          hash: false,
          fetch: true,
        },
      },
      expectedFiles: ['polyfills/fetch.js'],
    });
  });

  it('generates a loader script with one system resource', () => {
    testSnapshot({
      name: 'system-resource',
      config: {
        modern: { files: [{ type: fileTypes.SYSTEMJS, path: 'app.js' }] },
        polyfills: {
          hash: false,
          fetch: true,
        },
      },
      expectedFiles: ['polyfills/fetch.js', 'polyfills/systemjs.js'],
    });
  });

  it('generates a loader script with one script resource', () => {
    testSnapshot({
      name: 'script-resource',
      config: {
        modern: { files: [{ type: fileTypes.SCRIPT, path: 'app.js' }] },
        polyfills: {
          hash: false,
          fetch: true,
        },
      },
      expectedFiles: ['polyfills/fetch.js'],
    });
  });

  it('generates a loader script with multiple resources', () => {
    testSnapshot({
      name: 'module-resources',
      config: {
        modern: {
          files: [
            { type: fileTypes.MODULE, path: 'app.js' },
            { type: fileTypes.SCRIPT, path: 'shared.js' },
            { type: fileTypes.SYSTEMJS, path: 'other.js' },
          ],
        },
        polyfills: {
          hash: false,
          fetch: true,
        },
      },
      expectedFiles: ['polyfills/fetch.js', 'polyfills/systemjs.js'],
    });
  });

  it('generates a loader script with legacy resources', () => {
    testSnapshot({
      name: 'module-legacy-system',
      config: {
        modern: { files: [{ type: fileTypes.MODULE, path: 'app.js' }] },
        legacy: [
          {
            test: noModuleSupportTest,
            files: [{ type: fileTypes.SYSTEMJS, path: 'legacy/app.js' }],
          },
        ],
        polyfills: {
          hash: false,
          fetch: true,
        },
      },
      expectedFiles: ['polyfills/fetch.js', 'polyfills/systemjs.js'],
    });
  });

  it('generates a loader script with multiple legacy resources', () => {
    testSnapshot({
      name: 'module-legacy-system-multiple',
      config: {
        modern: {
          files: [
            { type: fileTypes.MODULE, path: 'app-1.js' },
            { type: fileTypes.MODULE, path: 'app-2.js' },
          ],
        },
        legacy: [
          {
            test: noModuleSupportTest,
            files: [
              { type: fileTypes.SYSTEMJS, path: 'legacy/app-1.js' },
              { type: fileTypes.SYSTEMJS, path: 'legacy/app-2.js' },
            ],
          },
        ],
        polyfills: {
          hash: false,
          fetch: true,
        },
      },
      expectedFiles: ['polyfills/fetch.js', 'polyfills/systemjs.js'],
    });
  });

  it('generates a loader script with multiple types of legacy resources', () => {
    testSnapshot({
      name: 'multiple-legacy',
      config: {
        modern: {
          files: [
            { type: fileTypes.MODULE, path: 'app-1.js' },
            { type: fileTypes.SCRIPT, path: 'app-2.js' },
          ],
        },
        legacy: [
          {
            test: noModuleSupportTest,
            files: [
              { type: fileTypes.SYSTEMJS, path: 'legacy/app-1.js' },
              { type: fileTypes.SCRIPT, path: 'legacy/app-2.js' },
            ],
          },
          {
            test: "'foo' in bar",
            files: [
              { type: fileTypes.SCRIPT, path: 'foobar/app-1.js' },
              { type: fileTypes.SYSTEMJS, path: 'foobar/app-2.js' },
            ],
          },
        ],
        polyfills: {
          hash: false,
          fetch: true,
        },
      },
      expectedFiles: ['polyfills/fetch.js', 'polyfills/systemjs.js'],
    });
  });

  it('generates a loader script with multiple polyfills', () => {
    testSnapshot({
      name: 'polyfills',
      config: {
        modern: { files: [{ type: fileTypes.MODULE, path: 'app.js' }] },
        polyfills: {
          hash: false,
          coreJs: true,
          webcomponents: true,
          fetch: true,
        },
      },
      expectedFiles: [
        'polyfills/fetch.js',
        'polyfills/webcomponents.js',
        'polyfills/custom-elements-es5-adapter.js',
        'polyfills/core-js.js',
      ],
    });
  });

  it('generates a loader script with customized polyfills directory', () => {
    testSnapshot({
      name: 'custom-polyfills-dir',
      config: {
        modern: { files: [{ type: fileTypes.MODULE, path: 'app.js' }] },
        polyfillsDir: 'foo/bar',
        polyfills: {
          hash: false,
          coreJs: true,
          webcomponents: true,
          fetch: true,
        },
      },
      expectedFiles: [
        'foo/bar/fetch.js',
        'foo/bar/webcomponents.js',
        'foo/bar/custom-elements-es5-adapter.js',
        'foo/bar/core-js.js',
      ],
    });
  });

  it('generates a loader script with a polyfill with an initializer', () => {
    testSnapshot({
      name: 'polyfills-initializer',
      config: {
        modern: { files: [{ type: fileTypes.MODULE, path: 'app.js' }] },
        polyfills: {
          hash: false,
          coreJs: true,
          dynamicImport: true,
        },
      },
      expectedFiles: ['polyfills/dynamic-import.js', 'polyfills/core-js.js'],
    });
  });

  it('generates a loader script with a polyfill loaded as a module', () => {
    testSnapshot({
      name: 'polyfills-module',
      config: {
        modern: { files: [{ type: fileTypes.MODULE, path: 'app.js' }] },
        polyfills: {
          hash: false,
          coreJs: true,
          esModuleShims: true,
        },
      },
      expectedFiles: ['polyfills/es-module-shims.js', 'polyfills/core-js.js'],
    });
  });

  it('generates a loader script with upwards file path', () => {
    testSnapshot({
      name: 'upwards-file-path',
      config: {
        modern: { files: [{ type: fileTypes.MODULE, path: '../app.js' }] },
        polyfills: {
          hash: false,
          fetch: true,
        },
      },
      expectedFiles: ['polyfills/fetch.js'],
    });
  });

  it('generates a loader script with an absolute file path', () => {
    testSnapshot({
      name: 'absolute-file-path',
      config: {
        modern: { files: [{ type: fileTypes.MODULE, path: '/app.js' }] },
        polyfills: {
          hash: false,
          fetch: true,
        },
      },
      expectedFiles: ['polyfills/fetch.js'],
    });
  });

  it('can generate a minified loader', () => {
    testSnapshot({
      name: 'minified',
      config: {
        modern: { files: [{ type: fileTypes.MODULE, path: '/app.js' }] },
        minify: true,
        polyfills: {
          hash: false,
          fetch: true,
        },
      },
      expectedFiles: ['polyfills/fetch.js'],
    });
  });

  it('can generate a loader without polyfills or legacy', () => {
    testSnapshot({
      name: 'no-polyfills-no-legacy',
      config: {
        modern: { files: [{ type: fileTypes.MODULE, path: '/app.js' }] },
        minify: false,
      },
      expectedFiles: [],
    });
  });
});
