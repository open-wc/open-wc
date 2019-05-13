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

      // TODO: not yet within the 90% default
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
