/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const bsSettings = require('./packages/testing-karma-bs/bs-settings.js');
const createBaseConfig = require('./karma.conf.js');

module.exports = config => {
  config.set(
    merge(bsSettings(config), createBaseConfig(config), {
      browserStack: {
        project: 'open-wc',
      },
    }),
  );

  return config;
};
