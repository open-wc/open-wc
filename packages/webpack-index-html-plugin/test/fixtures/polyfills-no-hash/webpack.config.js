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
        hashPolyfills: false,
        coreJs: true,
        regeneratorRuntime: true,
        webcomponents: true,
      },
    }),
  ],
};
