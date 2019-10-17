// @ts-nocheck

const { DEFAULT_EXTENSIONS } = require('@babel/core');
const { findSupportedBrowsers } = require('@open-wc/building-utils');
const customMinifyCss = require('@open-wc/building-utils/custom-minify-css');
const resolve = require('rollup-plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const indexHTML = require('rollup-plugin-index-html');
const workbox = require('rollup-plugin-workbox');
const path = require('path');
const entrypointHashmanifest = require('rollup-plugin-entrypoint-hashmanifest');

const production = !process.env.ROLLUP_WATCH;

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
    ..._options,
    plugins: {
      indexHTML: true,
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

      production &&
        options.plugins.workbox &&
        workbox({
          mode: 'generateSW',
          workboxConfig: {
            // for spa client side routing, always return index.html
            navigateFallback: '/index.html',
            // where to output the generated sw
            swDest: path.join(process.cwd(), 'dist', 'sw.js'),
            // directory to match patterns against to be precached
            globDirectory: path.join(process.cwd(), 'dist'),
            // cache any html js and css by default
            globPatterns: ['**/*.{html,js,css}'],
          },
        }),
    ],
  };
};
