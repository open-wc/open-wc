const path = require('path');

function getCompatibility() {
  const indexOf = process.argv.indexOf('--compatibility');
  return indexOf === -1 ? 'auto' : process.argv[indexOf + 1];
}

const coverage = process.argv.includes('--coverage');
const compatibility = getCompatibility();

module.exports = config => {
  config.set({
    files: ['packages/karma-esm/demo/no-modules/**/*.test.js'],

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
      compatibility,
      polyfills: {
        webcomponents: true,
        fetch: true,
      },
      babelModernExclude: [
        '**/node_modules/sinon/**/*',
        '**/node_modules/mocha/**/*',
        '**/node_modules/chai/**/*',
        '**/node_modules/sinon/chai/**/*',
      ],
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

    coverageReporter: {
      reporters: [{ type: 'html' }, { type: 'lcovonly' }, { type: 'text-summary' }],
      dir: 'coverage',
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
