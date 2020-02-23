const { findSupportedBrowsers } = require('@open-wc/building-utils');
const customMinifyCSS = require('@open-wc/building-utils/custom-minify-css');
const { GenerateSW } = require('workbox-webpack-plugin');
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
  plugins: {
    indexHTML: true,
    workbox: true,
  },
};

/* eslint-disable-next-line no-shadow */
function createConfig(options, legacy) {
  if (options.entry) {
    /* eslint-disable-next-line no-console */
    console.warn(
      '[@open-wc/building-webpack]: options.entry is deprecated. Use options.input instead.',
    );
  }

  const firstConfig = legacy;
  const production = options.mode === 'production';
  const inputPrefix = legacy ? 'legacy/' : '';

  const outputFilename = `${inputPrefix}${
    production ? '[contenthash].js' : '[name].development.js'
  }`;
  const outputChunkFilename = `${inputPrefix}${
    production ? '[contenthash].js' : 'chunk-[id].development.js'
  }`;

  return {
    entry: options.input || options.entry,

    output: {
      filename: outputFilename,
      chunkFilename: outputChunkFilename,
      path: path.resolve(process.cwd(), `dist`),
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
          test: /\.js$|\.ts$/,
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
      firstConfig && new CleanWebpackPlugin(),

      options.plugins.indexHTML &&
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
      production &&
        options.plugins.workbox &&
        new GenerateSW({
          exclude: [/legacy\/.*.js/],
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
    plugins: {
      ...defaultOptions.plugins,
      ...(userOptions.plugins || {}),
    },
  };

  return [createConfig(options, true), createConfig(options, false)];
};
