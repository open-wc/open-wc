/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('webpack-merge');

module.exports = config => {
  const defaultConfig = createDefaultConfig(config);

  // fix path for coverage
  defaultConfig.webpack.module.rules[0].include = path.resolve('./demo');

  config.set(
    merge(defaultConfig, {
      files: [
        // allows running single tests with the --grep flag
        config.grep ? config.grep : 'test/**/*.test.js',
      ],
    }),
  );
  return config;
};
