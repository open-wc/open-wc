/* eslint-disable import/no-extraneous-dependencies */
const createDefaultConfig = require('@open-wc/testing-karma/default-config.js');
const merge = require('webpack-merge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // allows running single tests with the --grep flag
        { pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' },
      ],

      // you custom config
    }),
  );
  return config;
};
