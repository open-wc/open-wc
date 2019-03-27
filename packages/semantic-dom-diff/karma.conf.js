/* eslint-disable import/no-extraneous-dependencies */
const defaultSettings = require('@open-wc/testing-karma/default-settings.js');
const merge = require('webpack-merge');

module.exports = config => {
  config.set(
    merge(defaultSettings(config), {
      files: [
        // allows running single tests with the --grep flag
        config.grep ? config.grep : 'test/**/*.test.js',
      ],

      coverageIstanbulReporter: {
        thresholds: {
          global: {
            statements: 80,
            branches: 70,
            functions: 70,
            lines: 80,
          },
        },
      },
    }),
  );
  return config;
};
