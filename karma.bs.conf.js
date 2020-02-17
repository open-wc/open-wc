/* eslint-disable import/no-extraneous-dependencies */
const merge = require('deepmerge');
const { bsSettings } = require('./packages/testing-karma-bs');
const createBaseConfig = require('./karma.conf.js');

const overwriteMerge = (destinationArray, sourceArray) => sourceArray;

module.exports = config => {
  config.set(
    merge.all(
      [
        bsSettings(config),
        createBaseConfig(config),
        {
          browserStack: {
            project: 'open-wc',
          },

          client: {
            mocha: {
              timeout: 20000,
            },
          },

          // How long does Karma wait for a browser to reconnect
          browserDisconnectTimeout: 60000,
          // How long will Karma wait for a message from a browser before disconnecting from it
          browserNoActivityTimeout: 60000,
          // The number of disconnections tolerated
          browserDisconnectTolerance: 3,

          browsers: [
            'bs_win10_chrome_latest',
            'bs_win10_firefox_72',
            'bs_win10_edge_latest',
            'bs_osxmojave_safari_latest',
            'bs_win10_ie_11',
          ],

          customLaunchers: {
            bs_win10_firefox_72: {
              base: 'BrowserStack',
              browser: 'Firefox',
              browser_version: '72',
              os: 'Windows',
              os_version: '10',
            },
          },
        },
      ],
      { arrayMerge: overwriteMerge },
    ),
  );

  return config;
};
