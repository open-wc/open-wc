/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const { createDefaultConfig } = require('./packages/testing-karma');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // allows running single tests with the --grep flag 188 tests
        {
          pattern: config.grep ? config.grep : `packages/testing/test/**/*.test.js`,
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
