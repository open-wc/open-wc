/* eslint-disable prefer-template */
/** @typedef {import('../../src/types').EntrypointBundle} EntrypointBundle */

const { expect } = require('chai');
const { getOutputHtml } = require('../../src/getOutputHtml');

describe('getOutputHtml()', () => {
  /** @type {EntrypointBundle[]} */
  const defaultEntrypointBundles = [
    {
      options: { format: 'es' },
      // @ts-ignore
      entrypoints: [{ importPath: '/app.js' }, { importPath: '/module.js' }],
    },
  ];

  const defaultOptions = {
    pluginOptions: { inject: true },
    entrypointBundles: defaultEntrypointBundles,
  };

  it('injects bundle into a default generated HTML file', async () => {
    const output = await getOutputHtml(defaultOptions);

    expect(output).to.equal(
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
        '<script type="module" src="/app.js"></script>' +
        '<script type="module" src="/module.js"></script>' +
        '</body></html>',
    );
  });

  it('allows setting an output html template', async () => {
    const output = await getOutputHtml({
      ...defaultOptions,
      pluginOptions: {
        ...defaultOptions.pluginOptions,
        template: '<h1>Output template</h1>',
      },
    });

    expect(output).to.equal(
      '<html><head></head><body><h1>Output template</h1>' +
        '<script type="module" src="/app.js"></script>' +
        '<script type="module" src="/module.js"></script>' +
        '</body></html>',
    );
  });

  it('template can be a function', async () => {
    const output = await getOutputHtml({
      ...defaultOptions,
      pluginOptions: {
        ...defaultOptions.pluginOptions,
        template: () => '<h1>Output template</h1>',
      },
    });

    expect(output).to.equal(
      '<html><head></head><body><h1>Output template</h1>' +
        '<script type="module" src="/app.js"></script>' +
        '<script type="module" src="/module.js"></script>' +
        '</body></html>',
    );
  });

  it('uses the input HTML as output template', async () => {
    const output = await getOutputHtml({
      ...defaultOptions,
      inputHtml: '<h1>Input HTML</h1>',
    });
    expect(output).to.equal(
      '<html><head></head><body><h1>Input HTML</h1>' +
        '<script type="module" src="/app.js"></script>' +
        '<script type="module" src="/module.js"></script>' +
        '</body></html>',
    );
  });

  it('generates a HTML file for multiple rollup bundles', async () => {
    /** @type {EntrypointBundle[]} */
    const entrypointBundles = [
      {
        options: { format: 'es' },
        // @ts-ignore
        entrypoints: [{ importPath: '/app.js' }, { importPath: '/module.js' }],
      },
      {
        options: { format: 'system' },
        // @ts-ignore
        entrypoints: [{ importPath: '/legacy/app.js' }, { importPath: '/legacy/module.js' }],
      },
    ];

    const output = await getOutputHtml({ ...defaultOptions, entrypointBundles });
    expect(output).to.equal(
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
        '<script type="module" src="/app.js"></script>' +
        '<script type="module" src="/module.js"></script>' +
        '<script>System.import("/legacy/app.js");</script>' +
        '<script>System.import("/legacy/module.js");</script>' +
        '</body></html>',
    );
  });

  it('can prevent injecting output', async () => {
    const output = await getOutputHtml({
      ...defaultOptions,
      pluginOptions: {
        ...defaultOptions.pluginOptions,
        inject: false,
        template: '<h1>Just h1</h1>',
      },
    });

    expect(output).to.equal('<h1>Just h1</h1>');
  });

  it('can inject build output in template function', async () => {
    const output = await getOutputHtml({
      ...defaultOptions,
      pluginOptions: {
        ...defaultOptions.pluginOptions,
        inject: false,
        template: ({ bundle }) =>
          `<h1>Hello world</h1>` +
          bundle.entrypoints
            .map(e => `<script type="module" src="${e.importPath}"></script>`)
            .join(''),
      },
    });

    expect(output).to.equal(
      '<h1>Hello world</h1>' +
        '<script type="module" src="/app.js"></script>' +
        '<script type="module" src="/module.js"></script>',
    );
  });

  it('can inject multi build output in template function', async () => {
    /** @type {EntrypointBundle[]} */
    const entrypointBundles = [
      {
        options: { format: 'es' },
        // @ts-ignore
        entrypoints: [{ importPath: '/app.js' }, { importPath: '/module.js' }],
      },
      {
        options: { format: 'system' },
        // @ts-ignore
        entrypoints: [{ importPath: '/legacy/app.js' }, { importPath: '/legacy/module.js' }],
      },
    ];

    const output = await getOutputHtml({
      ...defaultOptions,
      entrypointBundles,
      pluginOptions: {
        ...defaultOptions.pluginOptions,
        inject: false,
        template: ({ bundles }) =>
          `<h1>Hello world</h1>` +
          bundles[0].entrypoints
            .map(e => `<script type="module" src="${e.importPath}"></script>`)
            .join('') +
          bundles[1].entrypoints
            .map(e => `<script nomodule src="${e.importPath}"></script>`)
            .join(''),
      },
    });

    expect(output).to.equal(
      '<h1>Hello world</h1>' +
        '<script type="module" src="/app.js"></script>' +
        '<script type="module" src="/module.js"></script>' +
        '<script nomodule src="/legacy/app.js"></script>' +
        '<script nomodule src="/legacy/module.js"></script>',
    );
  });

  it('can transform html output', async () => {
    const output = await getOutputHtml({
      ...defaultOptions,
      pluginOptions: {
        ...defaultOptions.pluginOptions,
        template: '<h1>Hello world</h1>',
        transform: html => html.replace('Hello world', 'Goodbye world'),
      },
    });

    expect(output).to.equal(
      '<html><head></head><body><h1>Goodbye world</h1>' +
        '<script type="module" src="/app.js"></script>' +
        '<script type="module" src="/module.js"></script>' +
        '</body></html>',
    );
  });

  it('allows setting multiple html transform functions', async () => {
    const output = await getOutputHtml({
      ...defaultOptions,
      pluginOptions: {
        ...defaultOptions.pluginOptions,
        template: '<h1>Hello world</h1>',
        transform: [
          html => html.replace('Hello world', 'Goodbye world'),
          html => html.replace(/h1/g, 'h2'),
        ],
      },
    });

    expect(output).to.equal(
      '<html><head></head><body><h2>Goodbye world</h2>' +
        '<script type="module" src="/app.js"></script>' +
        '<script type="module" src="/module.js"></script>' +
        '</body></html>',
    );
  });

  it('default minify minifies html', async () => {
    const output = await getOutputHtml({
      ...defaultOptions,
      pluginOptions: {
        ...defaultOptions.pluginOptions,
        template:
          '<h1> Foo </h1> \n\n <!-- my comment --> <script type="text/javascript" src="foo.js"></script>',
        inject: false,
        minify: true,
      },
    });

    expect(output).to.equal('<h1>Foo</h1><script src="foo.js"></script>');
  });

  it('default minify minifies inline js', async () => {
    const output = await getOutputHtml({
      ...defaultOptions,
      pluginOptions: {
        ...defaultOptions.pluginOptions,
        template: '<script> (() => { \nconst foo = "bar"; \n console.log(foo);  })() </script>',
        inject: false,
        minify: true,
      },
    });

    expect(output).to.equal('<script>console.log("bar");</script>');
  });

  it('default minify minifies inline css', async () => {
    const output = await getOutputHtml({
      ...defaultOptions,
      pluginOptions: {
        ...defaultOptions.pluginOptions,
        template: '<style> * { color: blue; } </style>',
        inject: false,
        minify: true,
      },
    });

    expect(output).to.equal('<style>*{color:#00f}</style>');
  });

  it('can set custom minify options', async () => {
    const output = await getOutputHtml({
      ...defaultOptions,
      pluginOptions: {
        ...defaultOptions.pluginOptions,
        template:
          '<!-- my comment --> <style> * { color: blue; } </style> \n\n <script> (() => { \nconst foo = "bar"; \n console.log(foo);  })() </script>',
        inject: false,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: false,
          minifyJS: false,
        },
      },
    });

    expect(output).to.equal(
      '<style>* { color: blue; }</style><script>(() => { \nconst foo = "bar"; \n console.log(foo);  })()</script>',
    );
  });

  it('can set a custom minify function', async () => {
    const output = await getOutputHtml({
      ...defaultOptions,
      pluginOptions: {
        ...defaultOptions.pluginOptions,
        template: '<div>Foo</div>',
        inject: false,
        minify: html => `${html} <!-- custom minified -->`,
      },
    });

    expect(output).to.equal('<div>Foo</div> <!-- custom minified -->');
  });
});
