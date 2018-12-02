// eslint-disable-next-line import/no-extraneous-dependencies
const createBaseConfig = require('@open-wc/testing-karma-bs/create-karma-es5-bs.config');

module.exports = (config) => {
  const baseConfig = createBaseConfig(config);

  config.set({
    ...baseConfig,

    browserStack: {
      ...baseConfig.browserStack,
      project: 'your-name',
    },
  });
};
