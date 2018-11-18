const path = require('path');

module.exports = (config) => {
  config.set({
    browsers: [
      'ChromeHeadlessNoSandbox',
      // 'FirefoxHeadless'
    ],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      },
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless'],
      },
    },

    frameworks: ['mocha'],
    files: [
      { pattern: '../../node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js', watched: false },
      { pattern: '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js', watched: false },
      'test/index.js',
    ],
    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap'],
    },
    webpackMiddleware: {
      stats: 'errors-only',
    },
    reporters: ['dots', 'coverage-istanbul'],
    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
    //   config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,

    // ## code coverage config
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: path.join(__dirname, 'coverage'),
      combineBrowserReports: true,
      skipFilesWithNoCoverage: true,
      thresholds: {
        global: { // no real test files here
          statements: 0,
          lines: 0,
          branches: 0,
          functions: 0,
        },
      },
    },
    webpack: {
      devtool: 'inline-source-map',
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules\/(?!(@webcomponents\/shadycss|lit-html)\/).*/,
            options: {
              cacheDirectory: true,
            },
          },
          {
            test: /\.js$/,
            loader: 'istanbul-instrumenter-loader',
            enforce: 'post',
            include: path.resolve('./'),
            exclude: /node_modules|\.test\.js$/,
            options: {
              esModules: true,
            },
          },
        ],
      },
    },

    // ci settings
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
  });
};
