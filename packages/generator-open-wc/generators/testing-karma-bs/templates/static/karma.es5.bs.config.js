// eslint-disable-next-line import/no-extraneous-dependencies
const createBaseConfig = require('@open-wc/testing-karma-bs/create-karma-es5-bs.config');

module.exports = (config) => {
  const baseConfig = createBaseConfig(config);

  config.set({
    ...baseConfig,

    files: [
      ...baseConfig.files,
      // allows running single tests with the --grep flag
      config.grep ? [config.grep] : 'test/**/*.test.js',
    ],

    browserStack: {
      ...baseConfig.browserStack,
      project: 'your-name',
    },
  });
};
