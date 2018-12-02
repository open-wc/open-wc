const createBaseConfig = require('../create-karma-es5-bs.config');

module.exports = (config) => {
  const baseConfig = createBaseConfig(config, '/demo');

  config.set({
    ...baseConfig,

    browserStack: {
      ...baseConfig.browserStack,
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
  });
};
