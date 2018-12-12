// eslint-disable-next-line import/no-extraneous-dependencies
const createBaseConfig = require('@open-wc/testing-karma/create-karma-config');

module.exports = config => {
  const baseConfig = createBaseConfig(config);

  config.set({
    ...baseConfig,

    files: [
      // allows running single tests with the --grep flag
      config.grep ? config.grep : 'test/**/*.test.js',
    ],

    // is a meta package with with just some smoke tests
    coverageIstanbulReporter: {
      thresholds: {
        global: {
          statements: 0,
          branches: 0,
          functions: 0,
          lines: 0,
        },
      },
    },
  });
};
