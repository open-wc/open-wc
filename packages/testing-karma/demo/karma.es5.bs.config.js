// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge');
const karmaEs5Config = require('./karma.es5.config.js');

if (!process.env.BROWSER_STACK_USERNAME || !process.env.BROWSER_STACK_ACCESS_KEY) {
  throw new Error(`
    !!You have to set your Browserstack automate username and key!!

    Login and go to https://www.browserstack.com/accounts/settings
    then run in your console (or add it to your ~/.bashrc)

    export BROWSER_STACK_USERNAME=[username];
    export BROWSER_STACK_ACCESS_KEY=[key];
  `);
}

module.exports = config => {
  config.set(
    merge(karmaEs5Config(config), {
      browserStack: {
        username: process.env.BROWSER_STACK_USERNAME,
        accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
        project: 'open-wc',
      },

      browsers: ['bs_win10_chrome_69', 'bs_win10_firefox_62', 'bs_win10_ie_11'],

      // define browsers
      customLaunchers: {
        bs_win10_chrome_69: {
          base: 'BrowserStack',
          browser: 'Chrome',
          browser_version: '69.0',
          os: 'Windows',
          os_version: '10',
        },
        bs_win10_firefox_62: {
          base: 'BrowserStack',
          browser: 'Firefox',
          browser_version: '62.0',
          os: 'Windows',
          os_version: '10',
        },
        bs_win10_ie_11: {
          base: 'BrowserStack',
          browser: 'IE',
          browser_version: '11.0',
          os: 'Windows',
          os_version: '10',
        },
      },
    }),
  );
};
