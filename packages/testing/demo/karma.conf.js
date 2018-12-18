/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const defaultSettings = require('@open-wc/testing-karma/default-settings.js');
const merge = require('webpack-merge');

module.exports = config => {
  const baseConfig = defaultSettings(config);

  // fix path for coverage
  baseConfig.webpack.module.rules[0].include = path.resolve('./demo');

  config.set(
    merge(baseConfig, {
      files: [
        // allows running single tests with the --grep flag
        config.grep ? config.grep : 'test/**/*.test.js',
      ],
    }),
  );
  return config;
};
