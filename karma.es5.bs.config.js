/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const bsSettings = require('./packages/testing-karma-bs/bs-settings.js');
const karmaEs5Config = require('./karma.es5.config.js');

module.exports = config => {
  config.set(
    merge(bsSettings(config), karmaEs5Config(config), {
      browserStack: {
        project: 'open-wc',
      },
    }),
  );

  return config;
};
