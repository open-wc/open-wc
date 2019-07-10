const merge = require('webpack-merge');
const path = require('path');
const createBaseConfig = require('./src/base-config');

const coverage = process.argv.find(arg => arg.includes('coverage'));

// Ensure that in legacy mode, tests are not served as modules
function legacyFramework(parsedConfig) {
  parsedConfig.files.forEach(file => {
    if (file.type === 'module') {
      /* eslint-disable no-param-reassign */
      file.type = undefined;
    }
  });
}

legacyFramework.$inject = ['config'];

/**
 * Creates karma configuration for legacy browsers down to IE11.
 */
module.exports = function createLegacyConfig(config) {
  const baseConfig = createBaseConfig(config);

  return merge(baseConfig, {
    files: [
      { pattern: require.resolve('@babel/polyfill/dist/polyfill.min.js'), watched: false },
      {
        pattern: require.resolve('@webcomponents/webcomponentsjs/custom-elements-es5-adapter'),
        watched: false,
      },
      {
        pattern: require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle'),
        watched: false,
      },
    ],

    plugins: [
      // resolve plugins relative to this config so that they don't always need to exist
      // at the top level
      require.resolve('karma-webpack'),
      require.resolve('karma-sourcemap-loader'),
      { 'framework:legacy': ['factory', legacyFramework] },
    ],

    frameworks: ['webpack', 'legacy'],

    preprocessors: {
      '**/*.test.js': ['webpack', 'sourcemap'],
      '**/*.spec.js': ['webpack', 'sourcemap'],
    },

    webpack: {
      devtool: 'inline-cheap-module-source-map',

      resolve: {
        symlinks: false,
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

          {
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
        ].filter(_ => !!_),
      },
    },
  });
};
