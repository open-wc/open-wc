const merge = require('webpack-merge');
const es5Settings = require('./packages/testing-karma/es5-settings.js');
const karmaConf = require('./karma.conf.js');

module.exports = config => {
  config.set(merge(es5Settings(config), karmaConf(config)));
  return config;
};
