// @ts-nocheck

const { DEFAULT_EXTENSIONS } = require('@babel/core');
const { findSupportedBrowsers } = require('@open-wc/building-utils');
const customMinifyCss = require('@open-wc/building-utils/custom-minify-css');
const resolve = require('rollup-plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const indexHTML = require('rollup-plugin-index-html');
const entrypointHashmanifest = require('rollup-plugin-entrypoint-hashmanifest');
const { generateSW } = require('rollup-plugin-workbox');

const getWorkboxConfig = require('@open-wc/building-utils/get-workbox-config');

const production = !process.env.ROLLUP_WATCH;

const DEFAULT_DEDUPE_MODULES = ['lit-html', 'lit-element'];

/**
 * @typedef {ConfigOptions}
 * @param {*} _options
 * @param {*} legacy
 */

module.exports = function createBasicConfig(_options) {
  const options = {
    outputDir: 'dist',
    extensions: DEFAULT_EXTENSIONS,
    indexHTMLPlugin: {},
    dedupeModules: [],
    ..._options,
    plugins: {
      indexHTML: _options.input.endsWith('.html'),
      workbox: true,
      babel: true,
      ...(_options.plugins || {}),
    },
  };

  const { dedupeModules, extensions } = options;

  // Disabling linting for this tabular ternary.
  // predicates on the left, results on the right, followed by the default.
  /* eslint-disable no-nested-ternary */
  // prettier-ignore
  const dedupe =
      Array.isArray(dedupeModules) ? [...DEFAULT_DEDUPE_MODULES, ...dedupeModules]
    : dedupeModules === 'all' ? () => true
    : dedupeModules === false ? []
    : typeof dedupeModules === 'function' ? dedupeModules
    : DEFAULT_DEDUPE_MODULES
  /* eslint-enable no-nested-ternary */

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
        dedupe,
        extensions,
      }),

      // run code through babel
      options.plugins.babel &&
        babel({
          extensions: options.extensions,
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-syntax-import-meta',
            // rollup rewrites import.meta.url, but makes them point to the file location after bundling
            // we want the location before bundling
            'bundled-import-meta',
            production && [
              'template-html-minifier',
              {
                modules: {
                  'lit-html': ['html'],
                  'lit-element': ['html', { name: 'css', encapsulation: 'style' }],
                },
                htmlMinifier: {
                  collapseWhitespace: true,
                  removeComments: true,
                  caseSensitive: true,
                  minifyCSS: customMinifyCss,
                },
              },
            ],
          ].filter(_ => !!_),

          presets: [
            [
              '@babel/preset-env',
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
      production && terser(),

      // hash
      entrypointHashmanifest(),

      production && options.plugins.workbox && generateSW(getWorkboxConfig()),
    ],
  };
};
