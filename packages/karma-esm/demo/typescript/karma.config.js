const path = require('path');

function getCompatibility() {
  const indexOf = process.argv.indexOf('--compatibility');
  return indexOf === -1 ? 'auto' : process.argv[indexOf + 1];
}

const coverage = process.argv.includes('--coverage');
const compatibility = getCompatibility();

module.exports = config => {
  config.set({
    files: [{ pattern: 'packages/karma-esm/demo/typescript/**/*.test.ts', type: 'module' }],

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

    frameworks: ['mocha', 'esm'],

    esm: {
      nodeResolve: true,
      babel: true,
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
      fileExtensions: ['.ts'],
      customBabelConfig: {
        plugins: [
          coverage && [
            require.resolve('babel-plugin-istanbul'),
            {
              exclude: ['**/node_modules/**', '**/*.test.ts'],
            },
          ],
          [
            '@babel/plugin-proposal-decorators',
            {
              decoratorsBeforeExport: true,
            },
          ],
          '@babel/plugin-proposal-class-properties',
        ].filter(Boolean),
        presets: ['@babel/preset-typescript'],
      },
    },

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
