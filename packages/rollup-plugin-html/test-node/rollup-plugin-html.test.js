/** @typedef {import('rollup').OutputChunk} OutputChunk */
/** @typedef {import('rollup').OutputAsset} OutputAsset */
/** @typedef {import('rollup').InputOptions} InputOptions */
/** @typedef {import('../rollup-plugin-html').RollupPluginHtml} RollupPluginHtml */
/** @typedef {(OutputChunk | OutputAsset)[]} Output */

const rollup = require('rollup');
const path = require('path');
const { expect } = require('chai');
const htmlPlugin = require('../rollup-plugin-html');

const relativeUrl = `./${path.relative(process.cwd(), __dirname)}`;

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

/** @param {string} str */
function stripNewlines(str) {
  return str.replace(/(\r\n|\n|\r)/gm, '');
}

describe('rollup-plugin-html', () => {
  it('can build an app with rollup bundle injected into a default HTML page and filename', async () => {
    const config = {
      input: require.resolve('./fixtures/rollup-plugin-html/entrypoint-a.js'),
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
    expect(stripNewlines(getAsset(output, 'index.html').source)).to.equal(
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
        '<script type="module" src="./entrypoint-a.js"></script>' +
        '</body></html>',
    );
  });

  it('can build with plugin option "files" as input', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          files: require.resolve('./fixtures/rollup-plugin-html/index.html'),
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
    expect(stripNewlines(getAsset(output, 'index.html').source)).to.equal(
      '<html><head></head><body><h1>hello world</h1>' +
        '<script type="module" src="./entrypoint-a.js"></script>' +
        '<script type="module" src="./entrypoint-b.js"></script>' +
        '</body></html>',
    );
  });

  it('[deprecated] can build with plugin option "inputPath" as input', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          inputPath: require.resolve('./fixtures/rollup-plugin-html/index.html'),
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
    expect(stripNewlines(getAsset(output, 'index.html').source)).to.equal(
      '<html><head></head><body><h1>hello world</h1>' +
        '<script type="module" src="./entrypoint-a.js"></script>' +
        '<script type="module" src="./entrypoint-b.js"></script>' +
        '</body></html>',
    );
  });

  it('can build with html file as rollup input', async () => {
    const config = {
      input: require.resolve('./fixtures/rollup-plugin-html/index.html'),
      plugins: [
        htmlPlugin({
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
    expect(stripNewlines(getAsset(output, 'index.html').source)).to.equal(
      '<html><head></head><body><h1>hello world</h1>' +
        '<script type="module" src="./entrypoint-a.js"></script>' +
        '<script type="module" src="./entrypoint-b.js"></script>' +
        '</body></html>',
    );
  });

  it('can build with pure html file as rollup input', async () => {
    const config = {
      input: require.resolve('./fixtures/rollup-plugin-html/pure-index.html'),
      plugins: [
        htmlPlugin({
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(stripNewlines(getAsset(output, 'pure-index.html').source)).to.equal(
      '<html><head></head><body><h1>hello world</h1></body></html>',
    );
  });

  it('can build with multiple pure html inputs', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          files: [
            require.resolve('./fixtures/rollup-plugin-html/pure-index.html'),
            require.resolve('./fixtures/rollup-plugin-html/pure-index2.html'),
          ],
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(stripNewlines(getAsset(output, 'pure-index.html').source)).to.equal(
      '<html><head></head><body><h1>hello world</h1></body></html>',
    );
    expect(stripNewlines(getAsset(output, 'pure-index2.html').source)).to.equal(
      '<html><head></head><body><h1>hey there</h1></body></html>',
    );
  });

  it('can build with pluginOption "html" string as input', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          name: 'index.html',
          html:
            '<h1>Hello world</h1>' +
            `<script type="module" src="${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-a.js"></script>`,
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(2);
    expect(stripNewlines(getAsset(output, 'index.html').source)).to.equal(
      '<html><head></head><body><h1>Hello world</h1>' +
        '<script type="module" src="./entrypoint-a.js"></script></body></html>',
    );
  });

  it('[deprecated] can build with a plugin option "inputHtml" as input', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          name: 'index.html',
          inputHtml:
            '<h1>Hello world</h1>' +
            `<script type="module" src="${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-a.js"></script>`,
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(2);
    expect(stripNewlines(getAsset(output, 'index.html').source)).to.equal(
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
            `<script type="module">import "${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-a.js";</script>`,
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(2);
    const { code: appCode } = getChunk(output, 'inline-module-index-0.js');
    expect(appCode).to.include("console.log('entrypoint-a.js');");
    expect(stripNewlines(getAsset(output, 'index.html').source)).to.equal(
      '<html><head></head><body><h1>Hello world</h1>' +
        '<script type="module" src="./inline-module-index-0.js"></script>' +
        '</body></html>',
    );
  });

  it('resolves inline module imports relative to the HTML file', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          inputPath: `${relativeUrl}/fixtures/rollup-plugin-html/foo/foo.html`,
          minify: false,
        }),
      ],
    };

    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(2);
    const { code: appCode } = getChunk(output, 'inline-module-foo-0.js');
    expect(appCode).to.include("console.log('foo');");
  });

  it('can build with js input and generated html output', async () => {
    const config = {
      input: require.resolve('./fixtures/rollup-plugin-html/entrypoint-a.js'),
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
      input: require.resolve('./fixtures/rollup-plugin-html/entrypoint-a.js'),
      plugins: [
        htmlPlugin({
          name: 'index.html',
          inputHtml:
            '<h1>Hello world</h1>' +
            `<script type="module" src="${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-a.js"></script>`,
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
      input: require.resolve('./fixtures/rollup-plugin-html/entrypoint-a.js'),
      plugins: [
        htmlPlugin({
          name: 'index.html',
          inputHtml:
            '<h1>Hello world</h1>' +
            `<script type="module" src="${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-a.js"></script>`,
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
      input: require.resolve('./fixtures/rollup-plugin-html/entrypoint-a.js'),
      plugins: [
        htmlPlugin({
          name: 'pages/index.html',
          inputHtml:
            '<h1>Hello world</h1>' +
            `<script type="module" src="${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-a.js"></script>`,
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
        `<script type="module" src="${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-a.js"></script>`,
      publicPath: '/static/',
      minify: false,
    });

    const config = {
      input: require.resolve('./fixtures/rollup-plugin-html/entrypoint-a.js'),
      plugins: [plugin],
    };

    const build = await rollup.rollup(config);
    const bundleA = build.generate({
      format: 'system',
      dir: 'dist',
      plugins: [plugin.addOutput('legacy')],
    });
    const bundleB = build.generate({
      format: 'es',
      dir: 'dist',
      plugins: [plugin.addOutput('modern')],
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
        '<script>System.import("/static/entrypoint-a.js");</script>' +
        '<script type="module" src="/static/entrypoint-a.js"></script></body></html>',
    );
  });

  it('can build with multiple build outputs, specifying a specific output directory', async () => {
    const plugin = htmlPlugin({
      name: 'index.html',
      outputBundleName: 'modern',
      inputHtml:
        '<h1>Hello world</h1>' +
        `<script type="module" src="${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-a.js"></script>`,
      publicPath: '/static/',
      minify: false,
    });

    const config = {
      input: require.resolve('./fixtures/rollup-plugin-html/entrypoint-a.js'),
      plugins: [plugin],
    };

    const build = await rollup.rollup(config);
    const bundleA = build.generate({
      format: 'system',
      dir: 'dist-1',
      plugins: [plugin.addOutput('legacy')],
    });
    const bundleB = build.generate({
      format: 'es',
      dir: 'dist-2',
      plugins: [plugin.addOutput('modern')],
    });

    const [{ output: outputA }, { output: outputB }] = await Promise.all([bundleA, bundleB]);

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
        '<script>System.import("/dist-1/entrypoint-a.js");</script>' +
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
            `<script type="module" src="${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-a.js"></script>`,
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
          inputPath: `${relativeUrl}/fixtures/rollup-plugin-html/index.html`,
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
      input: require.resolve('./fixtures/rollup-plugin-html/entrypoint-a.js'),
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
          html: [
            {
              name: 'page-a.html',
              html: `<h1>Page A</h1><script type="module" src="${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-a.js"></script>`,
            },
            {
              name: 'page-b.html',
              html: `<h1>Page B</h1><script type="module" src="${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-b.js"></script>`,
            },
            {
              name: 'page-c.html',
              html: `<h1>Page C</h1><script type="module" src="${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-c.js"></script>`,
            },
          ],
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

  it('creates sufficiently unique inline script names', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          html: [
            {
              name: 'foo/index.html',
              html: '<h1>Page A</h1><script type="module">console.log("A")</script>',
            },
            {
              name: 'bar/index.html',
              html: '<h1>Page B</h1><script type="module">console.log("B")</script>',
            },
            {
              name: 'x.html',
              html: '<h1>Page C</h1><script type="module">console.log("C")</script>',
            },
          ],
          inject: true,
          minify: false,
        }),
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(6);
    expect(getChunk(output, 'inline-module-index-0.js')).to.exist;
    expect(getChunk(output, 'inline-module-index-1.js')).to.exist;
    expect(getChunk(output, 'inline-module-x-2.js')).to.exist;
    expect(getAsset(output, 'foo/index.html').source).to.equal(
      '<html><head></head><body><h1>Page A</h1><script type="module" src="../inline-module-index-0.js"></script></body></html>',
    );
    expect(getAsset(output, 'bar/index.html').source).to.equal(
      '<html><head></head><body><h1>Page B</h1><script type="module" src="../inline-module-index-1.js"></script></body></html>',
    );
    expect(getAsset(output, 'x.html').source).to.equal(
      '<html><head></head><body><h1>Page C</h1><script type="module" src="./inline-module-x-2.js"></script></body></html>',
    );
  });

  it('outputs the hashed entrypoint name', async () => {
    const config = {
      plugins: [
        htmlPlugin({
          name: 'index.html',
          inputHtml:
            '<h1>Hello world</h1>' +
            `<script type="module" src="${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-a.js"></script>`,
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
            `<script type="module" src="${relativeUrl}/fixtures/rollup-plugin-html/entrypoint-a.js"></script>`,
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

  it('can get the filename with getHtmlFileName()', async () => {
    // default filename
    const pluginA = htmlPlugin({ inputHtml: 'Hello world' });
    // filename inferred from input filename
    const pluginB = htmlPlugin({
      inputPath: `${relativeUrl}/fixtures/rollup-plugin-html/my-page.html`,
    });
    // filename explicitly set
    const pluginC = htmlPlugin({
      name: 'pages/my-other-page.html',
      inputPath: `${relativeUrl}/fixtures/rollup-plugin-html/index.html`,
    });

    await rollup.rollup({
      input: require.resolve('./fixtures/rollup-plugin-html/entrypoint-a.js'),
      plugins: [pluginA],
    });
    await rollup.rollup({ plugins: [pluginB] });
    await rollup.rollup({ plugins: [pluginC] });

    expect(pluginA.getHtmlFileName()).to.equal('index.html');
    expect(pluginB.getHtmlFileName()).to.equal('my-page.html');
    expect(pluginC.getHtmlFileName()).to.equal('pages/my-other-page.html');
  });

  it('supports other plugins injecting a transform function', async () => {
    const config = {
      input: require.resolve('./fixtures/rollup-plugin-html/entrypoint-a.js'),
      plugins: [
        htmlPlugin({
          name: 'my-page.html',
          minify: false,
        }),
        {
          name: 'other-plugin',
          /** @param {InputOptions} options */
          buildStart(options) {
            if (!options.plugins) throw new Error('no plugins');
            const p = /** @type {RollupPluginHtml} */ (options.plugins.find(pl => {
              if (pl.name === '@open-wc/rollup-plugin-html') {
                const pl2 = /** @type {RollupPluginHtml} */ (pl);
                return pl2.getHtmlFileName() === 'my-page.html';
              }
              return false;
            }));

            p.addHtmlTransformer(html => html.replace('</body>', '<!-- injected --></body>'));
          },
        },
      ],
    };
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(outputConfig);

    expect(output.length).to.equal(2);
    expect(getChunk(output, 'entrypoint-a.js').code).to.include("console.log('entrypoint-a.js');");
    expect(getAsset(output, 'my-page.html').source).to.equal(
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
        '<script type="module" src="./entrypoint-a.js"></script>' +
        '<!-- injected --></body></html>',
    );
  });
});
