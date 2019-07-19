const { findSupportedBrowsers } = require('@open-wc/building-utils');
const WebpackIndexHTMLPlugin = require('@open-wc/webpack-index-html-plugin');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const customMinifyCSS = require('./src/custom-minify-css');

const development = !process.argv.find(arg => arg.includes('production'));

const defaultOptions = {
  input: './index.html',
};

module.exports = userOptions => {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  if (options.entry) {
    /* eslint-disable-next-line no-console */
    console.warn(
      '[@open-wc/building-webpack]: options.entry is deprecated. Use options.input instead.',
    );
  }

  const outputFilename = `[name].${development ? '' : '[contenthash].'}js`;

  return {
    entry: options.input || options.entry,

    output: {
      filename: outputFilename,
      chunkFilename: outputFilename,
      path: path.resolve(process.cwd(), 'dist'),
    },

    devtool: development ? 'cheap-module-source-map' : 'source-map',

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
          test: /\.js$|.ts$/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-syntax-import-meta',
                !development && [
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
                    targets: findSupportedBrowsers(),
                    // preset-env compiles template literals for safari 12 due to a small bug which
                    // doesn't affect most use cases. for example lit-html handles it: (https://github.com/Polymer/lit-html/issues/575)
                    exclude: ['@babel/plugin-transform-template-literals'],
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
        !development &&
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
      !development && new CleanWebpackPlugin(),

      new WebpackIndexHTMLPlugin(options.webpackIndexHTMLPlugin),
    ].filter(_ => !!_),

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
};
