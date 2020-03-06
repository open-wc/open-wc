/* eslint-disable no-await-in-loop */

/** @typedef {import('rollup').OutputChunk} OutputChunk */
/** @typedef {import('rollup').OutputAsset} OutputAsset */
/** @typedef {import('rollup').RollupOptions} RollupOptions */
/** @typedef {import('rollup').OutputOptions} OutputOptions */
/** @typedef {(OutputChunk | OutputAsset)[]} Output */

const rollup = require('rollup');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
// @ts-ignore
const html = require('@open-wc/rollup-plugin-html');
const polyfillsLoader = require('../rollup-plugin-polyfills-loader');

const updateSnapshots = process.argv.includes('--update-snapshots');

/**
 * @param {Output} output
 * @param {string} name
 * @returns {OutputAsset & { source: string }}
 */
function getAsset(output, name) {
  return /** @type {OutputAsset & { source: string }} */ (output.find(
    o => o.fileName === name && o.type === 'asset',
  ));
}

/**
 * @param {object} args
 * @param {string} args.name
 * @param {string} args.fileName
 * @param {RollupOptions} args.inputOptions
 * @param {OutputOptions[]} args.outputOptions
 */
async function testSnapshot({ name, fileName, inputOptions, outputOptions }) {
  const snapshotPath = path.join(__dirname, 'snapshots', `${name}.html`);
  const bundle = await rollup.rollup(inputOptions);
  let output;
  for (const outputConfig of outputOptions) {
    ({ output } = await bundle.generate(outputConfig));
  }

  if (!output) throw new Error('');

  const file = getAsset(output, fileName);
  if (!file) throw new Error(`Build did not output ${fileName}`);

  if (updateSnapshots) {
    fs.writeFileSync(snapshotPath, file.source, 'utf-8');
  } else {
    const snapshot = fs.readFileSync(snapshotPath, 'utf-8');
    expect(file.source.replace(/\s/g, '')).to.equal(snapshot.replace(/\s/g, ''));
  }
  return output;
}

/** @type {OutputOptions[]} */
const defaultOutputOptions = [
  {
    format: 'es',
    dir: 'dist',
  },
];

describe('rollup-plugin-polyfills-loader', () => {
  it('can inject a polyfills loader with a single output', async () => {
    const inputOptions = {
      plugins: [
        html({
          inputHtml: '<script type="module" src="test/fixtures/entrypoint-a.js"></script>',
          minify: false,
        }),
        polyfillsLoader({
          htmlFileName: 'index.html',
        }),
      ],
    };

    await testSnapshot({
      name: 'single-output',
      fileName: 'index.html',
      inputOptions,
      outputOptions: defaultOutputOptions,
    });
  });

  it('can set the html file name', async () => {
    const inputOptions = {
      plugins: [
        html({
          name: 'foo.html',
          inputHtml: '<script type="module" src="test/fixtures/entrypoint-a.js"></script>',
          minify: false,
        }),
        polyfillsLoader({
          htmlFileName: 'foo.html',
        }),
      ],
    };

    await testSnapshot({
      name: 'html-filename',
      fileName: 'foo.html',
      inputOptions,
      outputOptions: defaultOutputOptions,
    });
  });

  it('can set polyfills to load', async () => {
    const inputOptions = {
      plugins: [
        html({
          name: 'index.html',
          inputHtml: '<script type="module" src="test/fixtures/entrypoint-a.js"></script>',
          minify: false,
        }),
        polyfillsLoader({
          htmlFileName: 'index.html',
          polyfills: {
            webcomponents: true,
            fetch: true,
          },
        }),
      ],
    };

    const output = await testSnapshot({
      name: 'polyfills',
      fileName: 'index.html',
      inputOptions,
      outputOptions: defaultOutputOptions,
    });

    expect(output.find(o => o.fileName.startsWith('polyfills/webcomponents'))).to.exist;
    expect(output.find(o => o.fileName.startsWith('polyfills/fetch'))).to.exist;
  });

  it('can inject with multiple build outputs', async () => {
    const htmlPlugin = html({
      name: 'index.html',
      inputHtml: '<script type="module" src="test/fixtures/entrypoint-a.js"></script>',
      minify: false,
    });
    const inputOptions = {
      plugins: [
        htmlPlugin,
        polyfillsLoader({
          htmlFileName: 'index.html',
          modernOutput: 'modern',
          legacyOutput: [{ name: 'legacy', test: "!('noModule' in HTMLScriptElement.prototype)" }],
          polyfills: {
            webcomponents: true,
            fetch: true,
          },
        }),
      ],
    };

    /** @type {OutputOptions[]} */
    const outputOptions = [
      {
        format: 'system',
        dir: 'dist/legacy',
        plugins: [htmlPlugin.addOutput('legacy')],
      },
      {
        format: 'es',
        dir: 'dist',
        plugins: [htmlPlugin.addOutput('modern')],
      },
    ];

    await testSnapshot({
      name: 'multiple-outputs',
      fileName: 'index.html',
      inputOptions,
      outputOptions,
    });
  });

  it('polyfills loader can be minified by html plugin', async () => {
    const inputOptions = {
      plugins: [
        html({
          inputHtml: '<script type="module" src="test/fixtures/entrypoint-a.js"></script>',
        }),
        polyfillsLoader({
          htmlFileName: 'index.html',
        }),
      ],
    };

    await testSnapshot({
      name: 'minified',
      fileName: 'index.html',
      inputOptions,
      outputOptions: defaultOutputOptions,
    });
  });
});
