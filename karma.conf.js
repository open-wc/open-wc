/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const { createDefaultConfig } = require('./packages/testing-karma');

const packagesToTestInBrowser = [
  'dedupe-mixin',
  'lit-helpers',
  'scoped-elements',
  'semantic-dom-diff',
  'testing',
  'testing-helpers',
].join('|');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // allows running single tests with the --grep flag 188 tests
        {
          pattern: config.grep
            ? config.grep
            : `packages/*(${packagesToTestInBrowser})/test-browser/**/*.test.js`,
          type: 'module',
        },
      ],

      esm: {
        nodeResolve: true,
        coverageExclude: ['**/testing/import-wrappers/**'],
      },
    }),
  );
  return config;
};
