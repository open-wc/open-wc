const path = require('path');

const coverage = process.argv.find(arg => arg.includes('--coverage'));
const compatibility = process.argv.find(arg => arg.includes('--compatibility'));
const updateSnapshots = process.argv.find(arg => arg.includes('--update-snapshots'));
const pruneSnapshots = process.argv.find(arg => arg.includes('--prune-snapshots'));

/**
 * Creates base karma configuration.
 */
module.exports = config => ({
  browsers: ['ChromeHeadlessNoSandbox'],

  files: ['__snapshots__/**/*.md'],

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
    require.resolve('./src/snapshot-filename-preprocessor.js'),

    // fallback: resolve any karma- plugins
    'karma-*',
  ],

  frameworks: ['esm', 'mocha', 'snapshot', 'mocha-snapshot', 'source-map-support'],

  esm: {
    nodeResolve: true,
    babel: true,
    compatibility: compatibility ? 'all' : 'none',
    coverage,
    polyfills: {
      webcomponents: true,
      fetch: true,
    },
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
