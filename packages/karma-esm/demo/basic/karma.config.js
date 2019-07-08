const path = require('path');

const compatibility = process.argv.includes('--compatibility');
const coverage = process.argv.includes('--coverage');

module.exports = config => {
  config.set({
    files: [{ pattern: 'packages/karma-esm/demo/basic/**/*.test.js', type: 'module' }],

    basePath: path.resolve(__dirname, '..', '..', '..', '..'),

    browsers: ['ChromeHeadlessNoSandbox'],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    },

    plugins: [
      require.resolve('karma-mocha'),
      require.resolve('karma-mocha-reporter'),
      require.resolve('karma-source-map-support'),
      require.resolve('karma-chrome-launcher'),
      require.resolve('karma-coverage-istanbul-reporter'),
      require.resolve('../../karma-esm.js'),

      // fallback: resolve any karma- plugins
      'karma-*',
    ],

    esm: {
      nodeResolve: true,
      compatibility: compatibility ? 'all' : undefined,
      polyfills: {
        webcomponents: true,
        fetch: true,
      },
      customBabelConfig: !coverage
        ? undefined
        : {
            plugins: [
              [
                require.resolve('babel-plugin-istanbul'),
                {
                  exclude: ['**/node_modules/**', '**/*.test.js'],
                },
              ],
            ],
          },
    },

    frameworks: ['mocha', 'esm'],

    reporters: coverage ? ['mocha', 'coverage-istanbul'] : ['mocha'],

    mochaReporter: {
      showDiff: true,
    },

    restartOnFileChange: true,

    client: {
      mocha: {
        reporter: 'html',
      },
    },

    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: 'coverage',
      combineBrowserReports: true,
      skipFilesWithNoCoverage: false,
      thresholds: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
  });
};
