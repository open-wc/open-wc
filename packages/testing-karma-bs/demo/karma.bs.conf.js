/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const bsSettings = require('../bs-settings.js');
const createBaseConfig = require('./karma.conf.js');

module.exports = config => {
  config.set(
    merge(bsSettings(), createBaseConfig(config), {
      browserStack: {
        project: 'open-wc',
      },

      // // these are the default customLaunchers for browserstack - you can add your own as well
      // browsers: [
      //   'bs_win10_chrome_latest',
      //   'bs_win10_firefox_latest',
      //   'bs_win10_edge_latest',
      //   'bs_osxmojave_safari_latest',
      //   'bs_win10_ie_11',
      // ],
    }),
  );
  return config;
};
