// @ts-nocheck

const { findSupportedBrowsers, defaultFileExtensions } = require('@open-wc/building-utils');
const customMinifyCss = require('@open-wc/building-utils/custom-minify-css');
const resolve = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const indexHTML = require('rollup-plugin-index-html');
const { generateSW } = require('rollup-plugin-workbox');

const getWorkboxConfig = require('@open-wc/building-utils/get-workbox-config');

const production = !process.env.ROLLUP_WATCH;

/**
 * @typedef {ConfigOptions}
 * @param {*} _options
 * @param {*} legacy
 */

module.exports = function createBasicConfig(_options) {
  const options = {
    outputDir: 'dist',
    extensions: defaultFileExtensions,
    indexHTMLPlugin: {},
    ..._options,
    plugins: {
      indexHTML: _options.input.endsWith('.html'),
      workbox: true,
      babel: true,
      ...(_options.plugins || {}),
    },
  };

  return {
    input: options.input,
    treeshake: !!production,
    output: {
      dir: options.outputDir,
      format: 'esm',
      sourcemap: true,
      dynamicImportFunction: 'importShim',
      entryFileNames: '[name]-[hash].js',
      chunkFileNames: '[name]-[hash].js',
    },
    plugins: [
      // parse input index.html as input and feed any modules found to rollup
      options.plugins.indexHTML &&
        indexHTML({
          ...(options.indexHTMLPlugin || {}),
          polyfills: {
            ...((options.indexHTMLPlugin && options.indexHTMLPlugin.polyfills) || {}),
            dynamicImport: true,
            webcomponents: true,
          },
        }),

      // resolve bare import specifiers
      resolve({
        extensions: options.extensions,
        moduleDirectory: ['node_modules', 'web_modules'],
      }),

      // run code through babel
      options.plugins.babel &&
        babel({
          exclude: options.babelExclude,
          extensions: options.extensions,
          plugins: [
            require.resolve('@babel/plugin-syntax-dynamic-import'),
            require.resolve('@babel/plugin-syntax-import-meta'),
            // rollup rewrites import.meta.url, but makes them point to the file location after bundling
            // we want the location before bundling
            require.resolve('babel-plugin-bundled-import-meta'),
            production && [
              require.resolve('babel-plugin-template-html-minifier'),
              {
                modules: {
                  'lit-html': ['html'],
                  'lit-element': ['html', { name: 'css', encapsulation: 'style' }],
                },
                htmlMinifier: {
                  collapseWhitespace: true,
                  conservativeCollapse: true,
                  removeComments: true,
                  caseSensitive: true,
                  minifyCSS: customMinifyCss,
                },
              },
            ],
          ].filter(_ => !!_),

          presets: [
            [
              require.resolve('@babel/preset-env'),
              {
                targets: findSupportedBrowsers(),
                // preset-env compiles template literals for safari 12 due to a small bug which
                // doesn't affect most use cases. for example lit-html handles it: (https://github.com/Polymer/lit-html/issues/575)
                exclude: ['@babel/plugin-transform-template-literals'],
                useBuiltIns: false,
                modules: false,
              },
            ],
          ],
        }),

      // only minify if in production
      production &&
        terser({
          exclude: options.terserExclude,
        }),

      production && options.plugins.workbox && generateSW(getWorkboxConfig(options.outputDir)),
    ],
  };
};
