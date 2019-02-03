const path = require('path');

/**
 * Creates a basic karma configuration file.
 *
 * See demo/karma.conf.js for an example implementation.
 */
module.exports = config => ({
  browsers: ['ChromeHeadlessNoSandbox'],

  customLaunchers: {
    ChromeHeadlessNoSandbox: {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },

  frameworks: ['mocha', 'source-map-support', 'webpack'],

  middleware: ['static'],

  static: {
    path: path.join(__dirname, ''),
  },

  preprocessors: {
    '**/*.test.js': ['webpack', 'sourcemap'],
    '**/*.spec.js': ['webpack', 'sourcemap'],
  },

  reporters: ['mocha', 'coverage-istanbul'],

  mochaReporter: {
    showDiff: true,
  },

  colors: true,

  // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
  logLevel: config.LOG_INFO,

  // ## code coverage config
  coverageIstanbulReporter: {
    reports: ['html', 'lcovonly', 'text-summary'],
    dir: 'coverage',
    combineBrowserReports: true,
    skipFilesWithNoCoverage: true,
    thresholds: {
      global: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
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
          loader: 'istanbul-instrumenter-loader',
          enforce: 'post',
          include: path.resolve('./'),
          exclude: /node_modules|bower_components|\.test\.js$/,
          options: {
            esModules: true,
          },
        },

        {
          test: /\.js$/,
          loader: require.resolve('@open-wc/webpack/loaders/import-meta-url-loader.js'),
        },
      ],
    },
  },

  autoWatch: false,
  singleRun: true,
  concurrency: Infinity,
});
