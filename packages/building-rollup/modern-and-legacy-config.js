// @ts-nocheck

const { findSupportedBrowsers, defaultFileExtensions } = require('@open-wc/building-utils');
const customMinifyCss = require('@open-wc/building-utils/custom-minify-css');
const path = require('path');
const resolve = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const indexHTML = require('rollup-plugin-index-html');
const { generateSW } = require('rollup-plugin-workbox');

const getWorkboxConfig = require('@open-wc/building-utils/get-workbox-config');

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
    extensions: defaultFileExtensions,
    indexHTMLPlugin: {},
    ..._options,
    plugins: {
      indexHTML: _options.input.endsWith && _options.input.endsWith('.html'),
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
            [require.resolve('babel-plugin-bundled-import-meta'), { importStyle: 'baseURI' }],
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
                targets: legacy ? ['ie 11'] : findSupportedBrowsers(),
                // preset-env compiles template literals for safari 12 due to a small bug which
                // doesn't affect most use cases. for example lit-html handles it: (https://github.com/Polymer/lit-html/issues/575)
                exclude: legacy ? undefined : ['@babel/plugin-transform-template-literals'],
                useBuiltIns: false,
                modules: false,
                bugfixes: true,
              },
            ],
          ],
        }),

      // only minify if in production
      production &&
        terser({
          exclude: options.terserExclude,
        }),

      production &&
        options.plugins.workbox &&
        !legacy &&
        generateSW(getWorkboxConfig(options.outputDir)),
    ],
  };
}

module.exports = function createDefaultConfig(options) {
  if (!options.input) {
    throw new Error(`${prefix}: missing option 'input'.`);
  }

  return [createConfig(options, true), createConfig(options, false)];
};
