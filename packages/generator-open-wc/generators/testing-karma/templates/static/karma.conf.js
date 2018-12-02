// eslint-disable-next-line import/no-extraneous-dependencies
const createBaseConfig = require('@open-wc/testing-karma/create-karma-config');

module.exports = (config) => {
  const baseConfig = createBaseConfig(config);

  config.set({
    ...baseConfig,
  });
};
