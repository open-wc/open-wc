/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const { createDefaultConfig } = require('./packages/testing-karma');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // allows running single tests with the --grep flag
        {
          pattern: config.grep
            ? config.grep
            : 'packages/!(webpack-import-meta-loader|create|building-utils|demoing-storybook|webpack-index-html-plugin|rollup-plugin-index-html|import-maps-generate|import-maps-resolve|es-dev-server|karma-esm|building-rollup|building-webpack|polyfills-loader|rollup-plugin-html)/test/**/*.test.js',
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
