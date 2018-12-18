const path = require('path');

// eslint-disable-next-line import/no-extraneous-dependencies
const createBaseConfig = require('@open-wc/testing-karma/create-karma-config.js');

/**
 * An example karma configuration, taking the base config as a start and
 * adding the test files to run. Make sure to support the grep config option
 * to allow running individual tests.
 */
module.exports = config => {
  const baseConfig = createBaseConfig(config);

  // fix path for coverage
  baseConfig.webpack.module.rules[0].include = path.resolve('./demo');

  config.set({
    ...baseConfig,

    files: [
      // allows running single tests with the --grep flag
      config.grep ? config.grep : 'test/**/*.test.js',
    ],
  });
};
