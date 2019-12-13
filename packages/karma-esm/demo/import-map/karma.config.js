const path = require('path');

function getCompatibility() {
  const indexOf = process.argv.indexOf('--compatibility');
  return indexOf === -1 ? 'auto' : process.argv[indexOf + 1];
}

const coverage = process.argv.includes('--coverage');
const compatibility = getCompatibility();

module.exports = config => {
  config.set({
    files: [{ pattern: 'packages/karma-esm/demo/import-map/**/*.test.js', type: 'module' }],

    basePath: path.resolve(__dirname, '..', '..', '..', '..'),

    browsers: ['ChromeHeadlessNoSandbox'],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--enable-experimental-web-platform-features',
        ],
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
      importMap: path.resolve(__dirname, 'import-map.json'),
      compatibility,
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
