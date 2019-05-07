const merge = require('webpack-merge');
const createBaseConfig = require('./src/base-config');

const coverage = process.argv.find(arg => arg.includes('coverage'));

/**
 * Creates karma configuration for browsers which support es modules and dynamic imports.
 */
module.exports = function createEsmConfig(config) {
  const baseConfig = createBaseConfig(config);

  return merge(baseConfig, {
    plugins: [
      // resolve plugins relative to this config so that they don't always need to exist
      // at the top level
      require.resolve('@open-wc/karma-esm'),
    ],

    frameworks: ['esm'],

    middleware: ['esm'],

    preprocessors: {
      '**/*.test.js': ['esm'],
      '**/*.spec.js': ['esm'],
    },

    esm: {
      coverage,
      babel: {
        // exclude libraries which don't need babel processing for speed
        exclude: ['**/node_modules/sinon/**', '**/node_modules/@bundled-es-modules/**'],
      },
    },
  });
};
