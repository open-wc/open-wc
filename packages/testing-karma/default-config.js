const path = require('path');

const coverage = process.argv.find(arg => arg.includes('coverage'));
const legacy = process.argv.find(arg => arg.includes('legacy'));
const updateSnapshots = process.argv.find(arg => arg.includes('update-snapshots'));
const pruneSnapshots = process.argv.find(arg => arg.includes('prune-snapshots'));

/**
 * Creates a basic karma configuration file.
 *
 * See demo/karma.conf.js for an example implementation.
 */
module.exports = config => ({
  browsers: ['ChromeHeadlessNoSandbox'],

  files: legacy
    ? [
        { pattern: '__snapshots__/**/*.md' },
        { pattern: require.resolve('@babel/polyfill/dist/polyfill.min.js'), watched: false },
        {
          pattern: require.resolve('@webcomponents/webcomponentsjs/custom-elements-es5-adapter'),
          watched: false,
        },
        {
          pattern: require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle'),
          watched: false,
        },
      ]
    : ['__snapshots__/**/*.md'],

  customLaunchers: {
    ChromeHeadlessNoSandbox: {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },

  plugins: [
    // resolve plugins relative to this config so that they don't always need to exist
    // at the top level
    require.resolve('karma-mocha'),
    require.resolve('karma-mocha-reporter'),
    require.resolve('karma-source-map-support'),
    require.resolve('karma-webpack'),
    require.resolve('karma-sourcemap-loader'),
    require.resolve('karma-coverage-istanbul-reporter'),
    require.resolve('karma-static'),
    require.resolve('karma-snapshot'),
    require.resolve('karma-mocha-snapshot'),
    require.resolve('karma-chrome-launcher'),
    require.resolve('./src/snapshot-filename-preprocessor.js'),

    // fallback: resolve any karma- plugins
    'karma-*',
  ],

  frameworks: ['mocha', 'snapshot', 'mocha-snapshot', 'source-map-support', 'webpack'],

  middleware: ['static'],

  static: {
    path: path.join(process.cwd(), ''),
  },

  preprocessors: {
    '**/__snapshots__/**/*.md': ['snapshot', 'snapshot-filename'],
    '**/*.test.js': ['webpack', 'sourcemap'],
    '**/*.spec.js': ['webpack', 'sourcemap'],
  },

  reporters: coverage ? ['mocha', 'coverage-istanbul'] : ['mocha'],

  mochaReporter: {
    showDiff: true,
  },

  client: {
    mocha: {
      reporter: 'html',
    },
  },

  colors: true,

  // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
  logLevel: config.LOG_INFO,

  /** Some errors come in JSON format with a message property. */
  formatError(error) {
    try {
      if (typeof error !== 'string') {
        return error;
      }
      const parsed = JSON.parse(error);
      if (typeof parsed !== 'object' || !parsed.message) {
        return error;
      }
      return parsed.message;
    } catch (_) {
      return error;
    }
  },

  // ## code coverage config
  coverageIstanbulReporter: {
    reports: ['html', 'lcovonly', 'text-summary'],
    dir: 'coverage',
    combineBrowserReports: true,
    skipFilesWithNoCoverage: false,
    thresholds: {
      global: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
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

  webpack: {
    devtool: 'inline-cheap-module-source-map',

    resolve: {
      mainFields: [
        // current leading de-facto standard - see https://github.com/rollup/rollup/wiki/pkg.module
        'module',
        // previous de-facto standard, superceded by `module`, but still in use by some packages
        'jsnext:main',
        // standard package.json fields
        'browser',
        'main',
      ],
    },

    module: {
      rules: [
        coverage && {
          test: /\.js$/,
          loader: require.resolve('istanbul-instrumenter-loader'),
          enforce: 'post',
          include: path.resolve('./'),
          exclude: /node_modules|bower_components|\.(spec|test)\.js$/,
          options: {
            esModules: true,
          },
        },

        legacy && {
          test: /\.js$|\.ts$/,
          use: {
            loader: 'babel-loader',

            options: {
              plugins: [
                require.resolve('@babel/plugin-syntax-dynamic-import'),
                require.resolve('@babel/plugin-syntax-import-meta'),
                // webpack does not support import.meta.url yet, so we rewrite them in babel
                [require.resolve('babel-plugin-bundled-import-meta'), { importStyle: 'baseURI' }],
              ].filter(_ => !!_),

              presets: [[require.resolve('@babel/preset-env'), { targets: 'IE 11' }]],
            },
          },
        },

        !legacy && {
          test: /\.js$/,
          loader: require.resolve('@open-wc/webpack-import-meta-loader'),
        },
      ].filter(_ => !!_),
    },
  },

  autoWatch: false,
  singleRun: true,
  concurrency: Infinity,
});
