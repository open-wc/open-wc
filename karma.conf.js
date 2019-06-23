/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const createDefaultConfig = require('./packages/testing-karma/default-config.js');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // allows running single tests with the --grep flag
        {
          pattern: config.grep
            ? config.grep
            : 'packages/!(webpack-import-meta-loader|create|building-utils|webpack-index-html-plugin)/test/*.test.js',
          type: 'module',
        },
      ],
    }),
  );
  return config;
};
