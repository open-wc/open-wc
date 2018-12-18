// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge');
const karmaConf = require('./karma.conf.js');
const es5Settings = require('../es5-settings.js');

module.exports = config => {
  config.set(merge(karmaConf(config), es5Settings(config)));
  return config;
};
