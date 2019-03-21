const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const development = !process.argv.find(arg => arg.includes('production'));

const defaultOptions = {
  indexHTML: './index.html',
  entry: './index.js',
};

module.exports = userOptions => {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  return {
    entry: Array.isArray(options.entry) ? options.entry : [options.entry],

    output: {
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].js',
      path: path.resolve(process.cwd(), 'dist'),
    },

    devtool: development ? 'inline-source-map' : 'source-map',

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
                    htmlMinifier: { collapseWhitespace: true, removeComments: true },
                  },
                ],
                // webpack does not support import.meta.url yet, so we rewrite them in babel
                ['bundled-import-meta', { importStyle: 'baseURI' }],
              ].filter(_ => !!_),

              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
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
      !development && new CleanWebpackPlugin(),

      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, options.indexHTML),
        inject: 'head',
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
