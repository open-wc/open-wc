const path = require('path');
const fs = require('fs');
const WebpackIndexHTMLPlugin = require('../../webpack-index-html-plugin');

module.exports = {
  entry: path.resolve(__dirname, './app.js'),

  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
  },

  plugins: [
    new WebpackIndexHTMLPlugin({
      template: () => fs.readFileSync(path.resolve(__dirname, './app.js'), 'utf-8'),
    }),
  ],
};
