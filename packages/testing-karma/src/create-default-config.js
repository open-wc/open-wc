const path = require('path');

function getCompatibility() {
  if (process.argv.find(arg => arg.includes('--legacy'))) {
    /* eslint-disable-next-line no-console */
    console.warn(`testing-karma --legacy flag has been renamed to --compatibility`);
    return 'all';
  }

  const indexOf = process.argv.indexOf('--compatibility');
  return indexOf === -1 ? 'auto' : process.argv[indexOf + 1];
}

const compatibility = getCompatibility();
const coverage = process.argv.find(arg => arg.includes('--coverage'));
const updateSnapshots = process.argv.find(arg => arg.includes('--update-snapshots'));
const pruneSnapshots = process.argv.find(arg => arg.includes('--prune-snapshots'));

/**
 * Creates base karma configuration.
 */
module.exports = config => ({
  browsers: ['ChromeHeadlessNoSandbox'],

  files: ['__snapshots__/**/*.md', require.resolve('axe-core/axe.min.js')],

  customLaunchers: {
    ChromeHeadlessNoSandbox: {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },

  plugins: [
    // resolve plugins relative to this config so that they don't always need to exist
    // at the top level
    require.resolve('@open-wc/karma-esm'),
    require.resolve('karma-mocha'),
    require.resolve('karma-mocha-reporter'),
    require.resolve('karma-source-map-support'),
    require.resolve('karma-coverage-istanbul-reporter'),
    require.resolve('karma-snapshot'),
    require.resolve('karma-mocha-snapshot'),
    require.resolve('karma-chrome-launcher'),
    require.resolve('./snapshot-filename-preprocessor.js'),

    // fallback: resolve any karma- plugins
    'karma-*',
  ],

  frameworks: ['esm', 'mocha', 'snapshot', 'mocha-snapshot', 'source-map-support'],

  esm: {
    coverage,
    compatibility,
    // prevent compiling es5 libs
    babelExclude: [
      '**/node_modules/mocha/**/*',
      '**/node_modules/chai/**/*',
      '**/node_modules/sinon-chai/**/*',
      '**/node_modules/chai-dom/**/*',
      '**/node_modules/core-js-bundle/**/*',
    ],
    // sinon is not completely es5...
    babelModernExclude: ['**/node_modules/sinon/**/*'],
    // prevent compiling non-module libs
    babelModuleExclude: ['**/node_modules/mocha/**/*', '**/node_modules/core-js-bundle/**/*'],
    polyfills: {
      webcomponents: true,
      fetch: true,
    },
    exclude: ['**/__snapshots__/**/*'],
  },

  preprocessors: {
    '**/__snapshots__/**/*.md': ['snapshot', 'snapshot-filename'],
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

  colors: true,

  // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
  logLevel: config.LOG_INFO,

  // ## code coverage config
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

  snapshot: {
    update: updateSnapshots,
    prune: pruneSnapshots,
    // only warn about unused snapshots when running all tests
    limitUnusedSnapshotsInWarning: config.grep ? 0 : -1,
    pathResolver(basePath, suiteName) {
      return path.join(basePath, '__snapshots__', `${suiteName}.md`);
    },
  },

  autoWatch: false,
  singleRun: true,
  concurrency: Infinity,
});
