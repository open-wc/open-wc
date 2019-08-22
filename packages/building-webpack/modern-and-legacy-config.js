const { findSupportedBrowsers } = require('@open-wc/building-utils');
const customMinifyCSS = require('@open-wc/building-utils/custom-minify-css');
const path = require('path');
const WebpackIndexHTMLPlugin = require('@open-wc/webpack-index-html-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const getDefaultMode = require('./src/get-default-mode');

const defaultOptions = {
  // default mode is set based on --mode parameter, or default
  // production. this can be overwritten manually in the config
  mode: getDefaultMode(),
  input: './index.html',
};

/* eslint-disable-next-line no-shadow */
function createConfig(options, legacy) {
  if (options.entry) {
    /* eslint-disable-next-line no-console */
    console.warn(
      '[@open-wc/building-webpack]: options.entry is deprecated. Use options.input instead.',
    );
  }

  const production = options.mode === 'production';
  const inputPrefix = legacy ? 'legacy/' : '';
  const outputFilename = `${inputPrefix}[name].${!production ? '' : '[contenthash].'}js`;

  return {
    entry: options.input || options.entry,

    output: {
      filename: outputFilename,
      chunkFilename: outputFilename,
      path: path.resolve(process.cwd(), `dist`),
    },

    mode: options.mode,

    devtool: production ? 'source-map' : 'cheap-module-source-map',

    // don't polyfill any node built-in libraries
    node: false,

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
        {
          test: /\.js$|\.ts$/,
          use: {
            loader: 'babel-loader',

            options: {
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-syntax-import-meta',
                production && [
                  'template-html-minifier',
                  {
                    modules: {
                      'lit-html': ['html'],
                      'lit-element': ['html', { name: 'css', encapsulation: 'style' }],
                    },
                    htmlMinifier: {
                      collapseWhitespace: true,
                      removeComments: true,
                      caseSensitive: true,
                      minifyCSS: customMinifyCSS,
                    },
                  },
                ],
                // webpack does not support import.meta.url yet, so we rewrite them in babel
                ['bundled-import-meta', { importStyle: 'baseURI' }],
              ].filter(_ => !!_),

              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: legacy ? ['ie 11'] : findSupportedBrowsers(),
                    // preset-env compiles template literals for safari 12 due to a small bug which
                    // doesn't affect most use cases. for example lit-html handles it: (https://github.com/Polymer/lit-html/issues/575)
                    exclude: legacy ? undefined : ['@babel/plugin-transform-template-literals'],
                    useBuiltIns: false,
                    modules: false,
                  },
                ],
              ],
            },
          },
        },
      ].filter(_ => !!_),
    },

    optimization: {
      minimizer: [
        production &&
          new TerserPlugin({
            terserOptions: {
              output: {
                comments: false,
              },
            },
            parallel: true,
            sourceMap: true,
          }),
      ].filter(_ => !!_),
    },

    plugins: [
      // @ts-ignore
      production && new CleanWebpackPlugin(),

      new WebpackIndexHTMLPlugin(
        merge(
          {
            multiBuild: true,
            legacy,
            polyfills: {
              coreJs: true,
              regeneratorRuntime: true,
              webcomponents: true,
              fetch: true,
            },
          },
          options.webpackIndexHTMLPlugin,
        ),
      ),
    ].filter(_ => !!_),

    devServer: {
      contentBase: process.cwd(),
      compress: true,
      port: 8080,
      historyApiFallback: false,
      stats: {
        stats: 'errors-only',
      },
    },
  };
}

module.exports = userOptions => {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  return [createConfig(options, true), createConfig(options, false)];
};
