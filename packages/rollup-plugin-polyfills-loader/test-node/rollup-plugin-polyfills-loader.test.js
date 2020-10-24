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

const relativeUrl = `./${path.relative(process.cwd(), __dirname)}`;

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

describe('rollup-plugin-polyfills-loader', function describe() {
  // bootup of the first test can take a long time in CI to load all the polyfills
  this.timeout(5000);

  it('can inject a polyfills loader with a single output', async () => {
    const inputOptions = {
      plugins: [
        html({
          inputHtml: `<script type="module" src="${relativeUrl}/fixtures/entrypoint-a.js"></script>`,
          inject: false,
          minify: false,
        }),
        polyfillsLoader({
          polyfills: { hash: false, fetch: true },
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
          name: 'bar.html',
          inputHtml: `<script type="module" src="${relativeUrl}/fixtures/entrypoint-a.js"></script>Bar`,
          inject: false,
          minify: false,
        }),
        html({
          name: 'foo.html',
          inputHtml: `<script type="module" src="${relativeUrl}/fixtures/entrypoint-a.js"></script>`,
          inject: false,
          minify: false,
        }),
        polyfillsLoader({
          htmlFileName: 'foo.html',
          polyfills: {
            hash: false,
            fetch: true,
          },
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
          inputHtml: `<script type="module" src="${relativeUrl}/fixtures/entrypoint-a.js"></script>`,
          inject: false,
          minify: false,
        }),
        polyfillsLoader({
          polyfills: {
            hash: false,
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
      inputHtml: `<script type="module" src="${relativeUrl}/fixtures/entrypoint-a.js"></script>`,
      inject: false,
      minify: false,
    });
    const inputOptions = {
      plugins: [
        htmlPlugin,
        polyfillsLoader({
          modernOutput: { name: 'modern' },
          legacyOutput: [{ name: 'legacy', test: "!('noModule' in HTMLScriptElement.prototype)" }],
          polyfills: { hash: false, webcomponents: true, fetch: true },
        }),
      ],
    };

    /** @type {OutputOptions[]} */
    const outputOptions = [
      {
        format: 'system',
        dir: 'dist',
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

  it('can customize the file type', async () => {
    const htmlPlugin = html({
      name: 'index.html',
      inputHtml: `<script type="module" src="${relativeUrl}/fixtures/entrypoint-a.js"></script>`,
      inject: false,
      minify: false,
    });
    const inputOptions = {
      plugins: [
        htmlPlugin,
        polyfillsLoader({
          modernOutput: { name: 'modern', type: 'script' },
          legacyOutput: [
            {
              name: 'legacy',
              type: 'script',
              test: "!('noModule' in HTMLScriptElement.prototype)",
            },
          ],
          polyfills: { hash: false, webcomponents: true, fetch: true },
        }),
      ],
    };

    /** @type {OutputOptions[]} */
    const outputOptions = [
      {
        format: 'system',
        dir: 'dist',
        plugins: [htmlPlugin.addOutput('legacy')],
      },
      {
        format: 'es',
        dir: 'dist',
        plugins: [htmlPlugin.addOutput('modern')],
      },
    ];

    await testSnapshot({
      name: 'customize-filetype',
      fileName: 'index.html',
      inputOptions,
      outputOptions,
    });
  });

  it('polyfills loader can be minified by html plugin', async () => {
    const inputOptions = {
      plugins: [
        html({
          inputHtml: `<script type="module" src="${relativeUrl}/fixtures/entrypoint-a.js"></script>`,
          inject: false,
        }),
        polyfillsLoader({
          polyfills: { hash: false, webcomponents: true, fetch: true },
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

  it('a regular module script is added when no polyfills need to be loaded', async () => {
    const inputOptions = {
      plugins: [
        html({
          inputHtml: `<script type="module" src="${relativeUrl}/fixtures/entrypoint-a.js"></script>`,
          inject: false,
          minify: false,
        }),
        polyfillsLoader(),
      ],
    };

    await testSnapshot({
      name: 'no-polyfills',
      fileName: 'index.html',
      inputOptions,
      outputOptions: defaultOutputOptions,
    });
  });
});
