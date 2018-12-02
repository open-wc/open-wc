// eslint-disable-next-line import/no-extraneous-dependencies
const createBaseConfig = require('@open-wc/testing-karma-bs/create-karma-es5-bs.config');

module.exports = (config) => {
  const baseConfig = createBaseConfig(config);

  config.set({
    ...baseConfig,

    browserStack: {
      ...baseConfig.browserStack,
      project: 'open-wc',
    },

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
  });
};
