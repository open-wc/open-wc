/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const defaultSettings = require('./packages/testing-karma/default-settings.js');

module.exports = config => {
  config.set(
    merge(defaultSettings(config), {
      files: [
        // allows running single tests with the --grep flag
        config.grep ? config.grep : 'packages/!(webpack-import-meta-loader)/test/*.test.js',
      ],

      coverageIstanbulReporter: {
        thresholds: {
          global: {
            statements: 80,
            lines: 80,
            branches: 80,
            functions: 80,
          },
        },
      },
    }),
  );
  return config;
};
