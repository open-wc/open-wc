/* eslint-disable import/no-extraneous-dependencies */
const merge = require('deepmerge');
const { bsSettings } = require('@open-wc/testing-karma-bs');
const createBaseConfig = require('./karma.conf.js');

module.exports = config => {
  config.set(
    merge(bsSettings(config), createBaseConfig(config), {
      browserStack: {
        project: 'your-name',
      },
    }),
  );

  return config;
};
