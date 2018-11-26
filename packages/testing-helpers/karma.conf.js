const createBaseConfig = require('../testing-karma/create-karma-config');

module.exports = (config) => {
  const baseConfig = createBaseConfig(config);

  config.set({
    ...baseConfig,

    files: [
      // allows running single tests with the --grep flag
      config.grep ? config.grep : 'test/**/*.test.js',
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
  });
};
