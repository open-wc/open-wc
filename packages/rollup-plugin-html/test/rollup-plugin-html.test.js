/** @typedef {import('rollup').OutputChunk} OutputChunk */
/** @typedef {import('rollup').OutputAsset} OutputAsset */
/** @typedef {(OutputChunk | OutputAsset)[]} Output */

const rollup = require('rollup');
const { expect } = require('chai');
const htmlPlugin = require('../rollup-plugin-html');

/**
 * @param {Output} output
 * @param {string} name
 * @returns {OutputChunk}
 */
function getChunk(output, name) {
  return /** @type {OutputChunk} */ (output.find(o => o.fileName === name && o.type === 'chunk'));
}

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

/** @type {any} */
const outputConfig = {
  format: 'es',
  dir: 'dist',
};

describe('rollup-plugin-html', () => {
  it('can build an app with rollup bundle injected into a default HTML page and filename', async () => {
    const config = {
      input: './test/fixtures/rollup-plugin-html/entrypoint-a.js',
      plugins: [
        htmlPlugin({
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(2);
    expect(getChunk(output, 'entrypoint-a.js').code).to.include("console.log('entrypoint-a.js');");
    expect(getAsset(output, 'index.html').source).to.equal(
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
        '<script type="module" src="./entrypoint-a.js"></script>' +
        '</body></html>',
    );
  });

  it('can build with html file as input', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          inputPath: 'test/fixtures/rollup-plugin-html/index.html',
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(4);
    const { code: entryA } = getChunk(output, 'entrypoint-a.js');
    const { code: entryB } = getChunk(output, 'entrypoint-b.js');
    expect(entryA).to.include("console.log('entrypoint-a.js');");
    expect(entryB).to.include("console.log('entrypoint-b.js');");
    expect(getAsset(output, 'index.html').source).to.equal(
      '<html><head></head><body><h1>hello world</h1>\n\n' +
        '<script type="module" src="./entrypoint-a.js"></script>' +
        '<script type="module" src="./entrypoint-b.js"></script>' +
        '</body></html>',
    );
  });

  it('can build with a html string as input', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          name: 'index.html',
          inputHtml:
            '<h1>Hello world</h1>' +
            '<script type="module" src="./test/fixtures/rollup-plugin-html/entrypoint-a.js"></script>',
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(2);
    expect(getAsset(output, 'index.html').source).to.equal(
      '<html><head></head><body><h1>Hello world</h1>' +
        '<script type="module" src="./entrypoint-a.js"></script></body></html>',
    );
  });

  it('can build with inline modules', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          name: 'index.html',
          inputHtml:
            '<h1>Hello world</h1>' +
            '<script type="module">import "./test/fixtures/rollup-plugin-html/entrypoint-a.js";</script>',
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(2);
    const { code: appCode } = getChunk(output, 'inline-module-index-0.js');
    expect(appCode).to.include("console.log('entrypoint-a.js');");
    expect(getAsset(output, 'index.html').source).to.equal(
      '<html><head></head><body><h1>Hello world</h1>' +
        '<script type="module" src="./inline-module-index-0.js"></script>' +
        '</body></html>',
    );
  });

  it('can build with js input and generated html output', async () => {
    const config = {
      input: './test/fixtures/rollup-plugin-html/entrypoint-a.js',
      plugins: [
        htmlPlugin({
          name: 'index.html',
          inject: false,
          template({ bundle }) {
            return `<h1>Hello world</h1>${bundle.entrypoints.map(
              e => `<script type="module" src="${e.importPath}"></script>`,
            )}`;
          },
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(2);
    expect(getAsset(output, 'index.html').source).to.equal(
      '<h1>Hello world</h1><script type="module" src="./entrypoint-a.js"></script>',
    );
  });

  it('can build transforming final output', async () => {
    const config = {
      input: './test/fixtures/rollup-plugin-html/entrypoint-a.js',
      plugins: [
        htmlPlugin({
          name: 'index.html',
          inputHtml:
            '<h1>Hello world</h1>' +
            '<script type="module" src="./test/fixtures/rollup-plugin-html/entrypoint-a.js"></script>',
          transform(html) {
            return html.replace('Hello world', 'Goodbye world');
          },
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(2);
    expect(getAsset(output, 'index.html').source).to.equal(
      '<html><head></head><body><h1>Goodbye world</h1>' +
        '<script type="module" src="./entrypoint-a.js"></script></body></html>',
    );
  });

  it('can build with a public path', async () => {
    const config = {
      input: './test/fixtures/rollup-plugin-html/entrypoint-a.js',
      plugins: [
        htmlPlugin({
          name: 'index.html',
          inputHtml:
            '<h1>Hello world</h1>' +
            '<script type="module" src="./test/fixtures/rollup-plugin-html/entrypoint-a.js"></script>',
          publicPath: '/static/',
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(2);
    expect(getAsset(output, 'index.html').source).to.equal(
      '<html><head></head><body><h1>Hello world</h1>' +
        '<script type="module" src="/static/entrypoint-a.js"></script></body></html>',
    );
  });

  it('can build with a public path with a file in a directory', async () => {
    const config = {
      input: './test/fixtures/rollup-plugin-html/entrypoint-a.js',
      plugins: [
        htmlPlugin({
          name: 'pages/index.html',
          inputHtml:
            '<h1>Hello world</h1>' +
            '<script type="module" src="./test/fixtures/rollup-plugin-html/entrypoint-a.js"></script>',
          publicPath: '/static/',
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(2);
    expect(getAsset(output, 'pages/index.html').source).to.equal(
      '<html><head></head><body><h1>Hello world</h1>' +
        '<script type="module" src="/static/entrypoint-a.js"></script></body></html>',
    );
  });

  it('can build with multiple build outputs', async () => {
    const plugin = htmlPlugin({
      name: 'index.html',
      inputHtml:
        '<h1>Hello world</h1>' +
        '<script type="module" src="./test/fixtures/rollup-plugin-html/entrypoint-a.js"></script>',
      publicPath: '/static/',
      minify: false,
    });

    const config = {
      input: './test/fixtures/rollup-plugin-html/entrypoint-a.js',
      plugins: [plugin],
    };

    const build = await rollup.rollup(config);
    const bundleA = build.generate({
      format: 'system',
      dir: 'dist/legacy',
      plugins: [plugin.addOutput()],
    });
    const bundleB = build.generate({
      format: 'es',
      dir: 'dist',
      plugins: [plugin.addOutput()],
    });

    const { output: outputA } = await bundleA;
    const { output: outputB } = await bundleB;

    expect(outputA.length).to.equal(1);
    expect(outputB.length).to.equal(2);
    const { code: entrypointA1 } = getChunk(outputA, 'entrypoint-a.js');
    const { code: entrypointA2 } = getChunk(outputB, 'entrypoint-a.js');
    expect(entrypointA1).to.include("console.log('entrypoint-a.js');");
    expect(entrypointA1).to.include("console.log('module-a.js');");
    expect(entrypointA2).to.include("console.log('entrypoint-a.js');");
    expect(entrypointA2).to.include("console.log('module-a.js');");
    expect(getAsset(outputA, 'index.html')).to.not.exist;
    expect(getAsset(outputB, 'index.html').source).to.equal(
      '<html><head></head><body><h1>Hello world</h1>' +
        '<script>System.import("/static/legacy/entrypoint-a.js");</script>' +
        '<script type="module" src="/static/entrypoint-a.js"></script></body></html>',
    );
  });

  it('can build with index.html as input and an extra html file as output', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          name: 'index.html',
          inputHtml:
            '<h1>Hello world</h1>' +
            '<script type="module" src="./test/fixtures/rollup-plugin-html/entrypoint-a.js"></script>',
          minify: false,
        }),

        htmlPlugin({
          name: 'foo.html',
          template: '<html><body><h1>foo.html</h1></body></html>',
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(3);
    expect(getChunk(output, 'entrypoint-a.js')).to.exist;
    expect(getAsset(output, 'index.html').source).to.equal(
      '<html><head></head><body><h1>Hello world</h1>' +
        '<script type="module" src="./entrypoint-a.js"></script></body></html>',
    );
    expect(getAsset(output, 'foo.html').source).to.equal(
      '<html><head></head><body><h1>foo.html</h1>' +
        '<script type="module" src="./entrypoint-a.js"></script>' +
        '</body></html>',
    );
  });

  it('can build with html file as input', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          inputPath: 'test/fixtures/rollup-plugin-html/index.html',
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(4);
    const { code: entryA } = getChunk(output, 'entrypoint-a.js');
    const { code: entryB } = getChunk(output, 'entrypoint-b.js');
    expect(entryA).to.include("console.log('entrypoint-a.js');");
    expect(entryB).to.include("console.log('entrypoint-b.js');");
    expect(getAsset(output, 'index.html').source).to.equal(
      '<html><head></head><body><h1>hello world</h1>\n\n' +
        '<script type="module" src="./entrypoint-a.js"></script>' +
        '<script type="module" src="./entrypoint-b.js"></script>' +
        '</body></html>',
    );
  });

  it('can build with js input, injecting the same bundle into multiple html files', async () => {
    const config = {
      input: './test/fixtures/rollup-plugin-html/entrypoint-a.js',
      plugins: [
        htmlPlugin({
          name: 'page-a.html',
          template: '<h1>Page A</h1>',
          minify: false,
        }),

        htmlPlugin({
          name: 'page-b.html',
          template: '<h1>Page B</h1>',
          minify: false,
        }),

        htmlPlugin({
          name: 'page-c.html',
          template: '<h1>Page C</h1>',
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(4);
    expect(getChunk(output, 'entrypoint-a.js')).to.exist;
    expect(getAsset(output, 'page-a.html').source).to.equal(
      '<html><head></head><body><h1>Page A</h1>' +
        '<script type="module" src="./entrypoint-a.js"></script>' +
        '</body></html>',
    );
    expect(getAsset(output, 'page-b.html').source).to.equal(
      '<html><head></head><body><h1>Page B</h1>' +
        '<script type="module" src="./entrypoint-a.js"></script>' +
        '</body></html>',
    );
    expect(getAsset(output, 'page-c.html').source).to.equal(
      '<html><head></head><body><h1>Page C</h1>' +
        '<script type="module" src="./entrypoint-a.js"></script>' +
        '</body></html>',
    );
  });

  it('can build with multiple html inputs', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          name: 'page-a.html',
          inputHtml:
            '<h1>Page A</h1><script type="module" src="./test/fixtures/rollup-plugin-html/entrypoint-a.js"></script>',
          minify: false,
        }),
        htmlPlugin({
          name: 'page-b.html',
          inputHtml:
            '<h1>Page B</h1><script type="module" src="./test/fixtures/rollup-plugin-html/entrypoint-b.js"></script>',
          minify: false,
        }),
        htmlPlugin({
          name: 'page-c.html',
          inputHtml:
            '<h1>Page C</h1><script type="module" src="./test/fixtures/rollup-plugin-html/entrypoint-c.js"></script>',
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(7);
    expect(getChunk(output, 'entrypoint-a.js')).to.exist;
    expect(getChunk(output, 'entrypoint-b.js')).to.exist;
    expect(getChunk(output, 'entrypoint-c.js')).to.exist;
    expect(getAsset(output, 'page-a.html').source).to.equal(
      '<html><head></head><body><h1>Page A</h1><script type="module" src="./entrypoint-a.js"></script></body></html>',
    );
    expect(getAsset(output, 'page-b.html').source).to.equal(
      '<html><head></head><body><h1>Page B</h1><script type="module" src="./entrypoint-b.js"></script></body></html>',
    );
    expect(getAsset(output, 'page-c.html').source).to.equal(
      '<html><head></head><body><h1>Page C</h1><script type="module" src="./entrypoint-c.js"></script></body></html>',
    );
  });

  it('outputs the hashed entrypoint name', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          name: 'index.html',
          inputHtml:
            '<h1>Hello world</h1>' +
            '<script type="module" src="./test/fixtures/rollup-plugin-html/entrypoint-a.js"></script>',
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate({
      ...outputConfig,
      entryFileNames: '[name]-[hash].js',
    });

    expect(output.length).to.equal(2);
    const entrypoint = /** @type {OutputChunk} */ (output.find(f =>
      // @ts-ignore
      f.facadeModuleId.endsWith('entrypoint-a.js'),
    ));
    // ensure it's actually hashed
    expect(entrypoint.fileName).to.not.equal('entrypoint-a.js');
    // get hashed name dynamically
    expect(getAsset(output, 'index.html').source).to.equal(
      `<html><head></head><body><h1>Hello world</h1><script type="module" src="./${entrypoint.fileName}"></script></body></html>`,
    );
  });

  it('outputs import path relative to the final output html', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          name: 'pages/index.html',
          inputHtml:
            '<h1>Hello world</h1>' +
            '<script type="module" src="./test/fixtures/rollup-plugin-html/entrypoint-a.js"></script>',
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(2);
    expect(getAsset(output, 'pages/index.html').source).to.equal(
      '<html><head></head><body><h1>Hello world</h1><script type="module" src="../entrypoint-a.js"></script></body></html>',
    );
  });
});
