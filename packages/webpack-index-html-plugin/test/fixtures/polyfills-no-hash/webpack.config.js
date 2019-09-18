const path = require('path');
const WebpackIndexHTMLPlugin = require('../../../webpack-index-html-plugin');

module.exports = {
  entry: path.resolve(__dirname, './index.html'),

  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
  },

  plugins: [
    new WebpackIndexHTMLPlugin({
      polyfills: {
        skipHash: true,
        coreJs: true,
        regeneratorRuntime: true,
        webcomponents: true,
      },
    }),
  ],
};
