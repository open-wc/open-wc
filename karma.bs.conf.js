/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const bsSettings = require('./packages/testing-karma-bs').bsSettings;
const createBaseConfig = require('./karma.conf.js');

module.exports = config => {
  config.set(
    merge(bsSettings(config), createBaseConfig(config), {
      browserStack: {
        project: 'open-wc',
      },

      // How long does Karma wait for a browser to reconnect
      browserDisconnectTimeout: 60000,
      // How long will Karma wait for a message from a browser before disconnecting from it
      browserNoActivityTimeout: 60000,
      // The number of disconnections tolerated
      browserDisconnectTolerance: 3,
    }),
  );

  return config;
};
