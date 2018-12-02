// eslint-disable-next-line import/no-extraneous-dependencies
const createBaseConfig = require('@open-wc/testing-karma/create-karma-config');

module.exports = (config) => {
  const baseConfig = createBaseConfig(config);

  config.set({
    ...baseConfig,

    // only smoke tests for chai here
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
