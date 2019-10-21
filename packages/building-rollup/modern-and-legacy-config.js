// @ts-nocheck

const { DEFAULT_EXTENSIONS } = require('@babel/core');
const { findSupportedBrowsers } = require('@open-wc/building-utils');
const customMinifyCss = require('@open-wc/building-utils/custom-minify-css');
const path = require('path');
const resolve = require('rollup-plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const indexHTML = require('rollup-plugin-index-html');
const entrypointHashmanifest = require('rollup-plugin-entrypoint-hashmanifest');
const { generateSW } = require('rollup-plugin-workbox');

const production = !process.env.ROLLUP_WATCH;
const prefix = '[owc-building-rollup]';

/**
 * Function which creates a config so that we can create a modern and a legacy config
 * with small alterations.
 * @param {object} _options
 * @param {boolean} legacy
 */
function createConfig(_options, legacy) {
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
      // output into given folder or default /dist. Output legacy into a /legacy subfolder
      dir: path.join(options.outputDir, legacy ? '/legacy' : ''),
      format: legacy ? 'system' : 'esm',
      sourcemap: true,
      dynamicImportFunction: !legacy && 'importShim',
      entryFileNames: '[name]-[hash].js',
      chunkFileNames: '[name]-[hash].js',
    },
    plugins: [
      options.plugins.indexHTML &&
        indexHTML({
          ...(options.indexHTMLPlugin || {}),
          // tell index-html-plugin that we are creating two builds
          multiBuild: true,
          // tell index-html-plugin whether this is the legacy config
          legacy,
          polyfills: {
            ...((options.indexHTMLPlugin && options.indexHTMLPlugin.polyfills) || {}),
            dynamicImport: true,
            coreJs: true,
            regeneratorRuntime: true,
            webcomponents: true,
            systemJs: true,
            fetch: true,
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
            ['bundled-import-meta', { importStyle: 'baseURI' }],
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
                targets: legacy ? ['ie 11'] : findSupportedBrowsers(),
                // preset-env compiles template literals for safari 12 due to a small bug which
                // doesn't affect most use cases. for example lit-html handles it: (https://github.com/Polymer/lit-html/issues/575)
                exclude: legacy ? undefined : ['@babel/plugin-transform-template-literals'],
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
        !legacy &&
        generateSW({
          // for spa client side routing, always return index.html
          navigateFallback: '/index.html',
          // where to output the generated sw
          swDest: path.join(process.cwd(), 'dist', 'sw.js'),
          // directory to match patterns against to be precached
          globDirectory: path.join(process.cwd(), 'dist'),
          // cache any html js and css by default
          globPatterns: ['**/*.{html,js,css}'],
        }),
    ],
  };
}

module.exports = function createDefaultConfig(options) {
  if (!options.input) {
    throw new Error(`${prefix}: missing option 'input'.`);
  }

  return [createConfig(options, true), createConfig(options, false)];
};
