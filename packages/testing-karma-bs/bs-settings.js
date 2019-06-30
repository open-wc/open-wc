if (!process.env.BROWSER_STACK_USERNAME || !process.env.BROWSER_STACK_ACCESS_KEY) {
  throw new Error(`
    !!You have to set your Browserstack automate username and key!!

    Login and go to https://www.browserstack.com/accounts/settings
    then run in your console (or add it to your ~/.bashrc)

    export BROWSER_STACK_USERNAME=[username];
    export BROWSER_STACK_ACCESS_KEY=[key];
  `);
}

/**
 * Extends the es5 karma config with a browserstack luncher
 *
 * By default runs tests in the latest stable versions of
 * - Chrome
 * - Firefox
 * - Safari
 * - Edge
 * and IE11.
 *
 * See demo/karma.es5.config.js for an example implementation.
 */
module.exports = () => ({
  browserStack: {
    username: process.env.BROWSER_STACK_USERNAME,
    accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
    project: 'open-wc',
  },

  browsers: [
    'bs_win10_chrome_latest',
    'bs_win10_firefox_latest',
    // 'bs_win10_edge_latest', // currently flaky on browser stack
    'bs_osxmojave_safari_latest',
    'bs_win10_ie_11',
    // specific versions
    'bs_win10_edge_17',
    'bs_win10_firefox_60ESR',
  ],

  // define browsers
  // https://www.browserstack.com/automate/capabilities
  customLaunchers: {
    bs_win10_chrome_latest: {
      base: 'BrowserStack',
      browser: 'Chrome',
      os: 'Windows',
      os_version: '10',
    },
    bs_win10_firefox_latest: {
      base: 'BrowserStack',
      browser: 'Firefox',
      os: 'Windows',
      os_version: '10',
    },
    bs_win10_edge_latest: {
      base: 'BrowserStack',
      browser: 'Edge',
      os: 'Windows',
      os_version: '10',
    },
    bs_osxmojave_safari_latest: {
      base: 'BrowserStack',
      browser: 'Safari',
      os: 'OS X',
      os_version: 'Mojave',
    },
    bs_win10_ie_11: {
      base: 'BrowserStack',
      browser: 'IE',
      browser_version: '11.0',
      os: 'Windows',
      os_version: '10',
    },
    bs_win10_edge_17: {
      base: 'BrowserStack',
      browser: 'Edge',
      browser_version: '17.0',
      os: 'Windows',
      os_version: '10',
    },
    bs_win10_firefox_60ESR: {
      base: 'BrowserStack',
      browser: 'Firefox',
      browser_version: '60.0',
      os: 'Windows',
      os_version: '10',
    },
  },
});
