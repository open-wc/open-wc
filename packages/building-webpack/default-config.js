const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BabelMultiTargetPlugin } = require('webpack-babel-multi-target-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const ENV = process.argv.find(arg => arg.includes('production')) ? 'production' : 'development';
const developmentEs5 = !!process.argv.find(arg => arg.includes('es5'));

const defaultOptions = {
  indexHTML: './index.html',
  indexJS: ['./index.js'],
};

const es6Target = {
  browsers: [
    'last 2 Chrome major versions',
    'last 2 ChromeAndroid major versions',
    'last 2 Edge major versions',
    'last 2 Firefox major versions',
    'last 3 Safari major versions',
    'last 3 iOS major versions',
  ],
  tagAssetsWithKey: false,
  esModule: true,
};

const es5Target = {
  browsers: ['ie 11'],
  tagAssetsWithKey: true,
  noModule: true,
  // polyfills/modules which should be included for the es5 build
  additionalModules: ['core-js/es6'],
};

if (ENV === 'development') {
  // web components compiled to es5 don't work on browsers with native support without the native-shim
  // this doesn't happen in production, so we load it only in dev-time
  es5Target.additionalModules.push('@webcomponents/custom-elements/src/native-shim.js');

  // if serving es5 in development mode, we want to load it on modern browsers too
  es5Target.noModule = false;
}

function getBrowserTargets() {
  // production: es6 and es5 output
  if (ENV === 'production') {
    return { es6: es6Target, es5: es5Target };
  }

  // development: es5 output for testing IE11
  if (developmentEs5) {
    return { es5: es5Target };
  }

  // development: only es6 output for speed
  return { es6: es6Target };
}

// eslint-disable-next-line
module.exports = userOptions => {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  const config = {
    entry: [options.indexJS],

    output: {
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].js',
      path: path.resolve(process.cwd(), 'dist'),
    },

    resolve: {
      // list taken from: https://github.com/DanielSchaffer/webpack-babel-multi-target-plugin
      mainFields: [
        // rxjs and Angular Package Format
        // these are generally shipped as a higher ES language level than `module`
        'es2015',
        'esm2015',
        'fesm2015',

        // current leading de-facto standard - see https://github.com/rollup/rollup/wiki/pkg.module
        'module',

        // previous de-facto standard, superceded by `module`, but still in use by some packages
        'jsnext:main',

        // Angular Package Format - lower ES level
        'esm5',
        'fesm5',

        // standard package.json fields
        'browser',
        'main',
      ],
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            BabelMultiTargetPlugin.loader(),
            require.resolve('@open-wc/webpack-import-meta-loader'),
          ],
        },
      ],
    },

    plugins: [
      // Babel configuration for multiple output bundles targeting different sets of browsers
      // for development, we only have a modern browser output
      new BabelMultiTargetPlugin({
        babel: {
          plugins: [
            // Minify HTML and CSS in tagged template literals
            [
              'template-html-minifier',
              {
                modules: {
                  'lit-html': ['html'],
                  'lit-element': ['html', { name: 'css', encapsulation: 'style' }],
                },
                htmlMinifier: {
                  collapseWhitespace: true,
                },
              },
            ],
            // fast async uses Promise instead of regenerator to compile async functions
            'module:fast-async',
          ],

          // @babel/preset-env options common for all bundles
          presetOptions: {
            useBuiltIns: false,
            // we use fast-async, it's faster than regenerator
            exclude: ['transform-async-to-generator', 'transform-regenerator'],
          },
        },
        safari10NoModuleFix: true,
        targets: getBrowserTargets(options),
      }),
      new HtmlWebpackPlugin({
        template: options.indexHTML,
        inject: true,
      }),
    ],

    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: true,
        }),
      ],
    },

    devtool: ENV === 'development' ? 'inline-source-map' : 'source-map',
    devServer: {
      contentBase: process.cwd(),
      compress: true,
      port: 8080,
      historyApiFallback: true,
      stats: {
        stats: 'errors-only',
      },
    },
  };

  if (ENV === 'production') {
    config.plugins = [new CleanWebpackPlugin(['dist']), ...config.plugins];
  }

  return config;
};
