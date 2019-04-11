// @ts-nocheck

const resolve = require('rollup-plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const minifyHTML = require('rollup-plugin-minify-html-literals').default;
const modernWeb = require('./plugins/rollup-plugin-modern-web/rollup-plugin-modern-web.js');

const production = !process.env.ROLLUP_WATCH;

module.exports = function createBasicConfig(_options) {
  const options = {
    outputDir: 'dist',
    ..._options,
  };

  return {
    input: options.input,
    treeshake: !!production,
    output: {
      dir: options.outputDir,
      format: 'esm',
      sourcemap: options.sourcemap !== undefined ? options.sourcemap : true,
    },
    plugins: [
      // minify html and css template literals if in production
      production &&
        minifyHTML({
          failOnError: true,
        }),

      // parse input index.html as input and feed any modules found to rollup
      modernWeb(),

      // resolve bare import specifiers
      resolve(),

      // run code through babel
      babel({
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-syntax-import-meta',
          // rollup rewrites import.meta.url, but makes them point to the file location after bundling
          // we want the location before bundling
          'bundled-import-meta',
        ],
        presets: [
          [
            '@babel/env',
            {
              targets: [
                'last 2 Chrome major versions',
                'last 2 ChromeAndroid major versions',
                'last 2 Edge major versions',
                'last 2 Firefox major versions',
                'last 2 Safari major versions',
                'last 2 iOS major versions',
              ],
              useBuiltIns: false,
            },
          ],
        ],
      }),

      // only minify if in production
      production && terser(),
    ],
  };
};
