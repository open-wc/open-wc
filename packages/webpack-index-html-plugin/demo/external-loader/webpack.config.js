const path = require('path');
const WebpackIndexHTMLPlugin = require('../../webpack-index-html-plugin');

module.exports = [
  {
    entry: path.resolve(__dirname, './index.html'),

    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js',
    },

    plugins: [
      new WebpackIndexHTMLPlugin({
        multiBuild: true,
        loader: 'external',
        polyfills: {
          coreJs: true,
          webcomponents: true,
        },
      }),
    ],
  },
  {
    entry: path.resolve(__dirname, './index.html'),

    output: {
      filename: 'legacy/[name].[contenthash].js',
      chunkFilename: 'legacy/[name].[contenthash].js',
    },

    plugins: [
      new WebpackIndexHTMLPlugin({
        multiBuild: true,
        legacy: true,
      }),
    ],
  },
];
