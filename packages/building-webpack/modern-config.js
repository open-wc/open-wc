const { findSupportedBrowsers } = require('@open-wc/building-utils');
const WebpackIndexHTMLPlugin = require('@open-wc/webpack-index-html-plugin');
const customMinifyCSS = require('@open-wc/building-utils/custom-minify-css');
const { GenerateSW } = require('workbox-webpack-plugin');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const getDefaultMode = require('./src/get-default-mode');

const defaultOptions = {
  // default mode is set based on --mode parameter, or default
  // production. this can be overwritten manually in the config
  mode: getDefaultMode(),
  input: './index.html',
  plugins: {
    indexHTML: true,
    workbox: true,
  },
};

module.exports = userOptions => {
  const options = {
    ...defaultOptions,
    ...userOptions,
    plugins: {
      ...defaultOptions.plugins,
      ...(userOptions.plugins || {}),
    },
  };

  const production = options.mode === 'production';

  if (options.entry) {
    /* eslint-disable-next-line no-console */
    console.warn(
      '[@open-wc/building-webpack]: options.entry is deprecated. Use options.input instead.',
    );
  }

  const outputFilename = production ? '[contenthash].js' : '[name].development.js';
  const outputChunkFilename = production ? '[contenthash].js' : 'chunk-[id].development.js';

  return {
    entry: options.input || options.entry,

    output: {
      filename: outputFilename,
      chunkFilename: outputChunkFilename,
      path: path.resolve(process.cwd(), 'dist'),
    },

    mode: options.mode,

    devtool: 'cheap-module-source-map',

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
      modules: ['node_modules', 'web_modules'],
    },

    module: {
      rules: [
        {
          test: /\.js$|.ts$/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                require.resolve('@babel/plugin-syntax-dynamic-import'),
                require.resolve('@babel/plugin-syntax-import-meta'),
                production && [
                  require.resolve('babel-plugin-template-html-minifier'),
                  {
                    modules: {
                      'lit-html': ['html'],
                      'lit-element': ['html', { name: 'css', encapsulation: 'style' }],
                    },
                    htmlMinifier: {
                      collapseWhitespace: true,
                      conservativeCollapse: true,
                      removeComments: true,
                      caseSensitive: true,
                      minifyCSS: customMinifyCSS,
                    },
                  },
                ],
                // webpack does not support import.meta.url yet, so we rewrite them in babel
                [require.resolve('babel-plugin-bundled-import-meta'), { importStyle: 'baseURI' }],
              ].filter(_ => !!_),

              presets: [
                [
                  require.resolve('@babel/preset-env'),
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
      new CleanWebpackPlugin(),

      new WebpackIndexHTMLPlugin(options.webpackIndexHTMLPlugin),
      production &&
        options.plugins.workbox &&
        new GenerateSW({
          exclude: [/polyfills\/.*.js/, /legacy\/.*.js/],
          // for spa client side routing, always return index.html
          navigateFallback: '/index.html',
          // where to output the generated sw
          swDest: 'sw.js',
        }),
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
