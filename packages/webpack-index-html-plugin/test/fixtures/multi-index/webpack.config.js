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
      multiIndex: {
        fallback: 'en-GB',
        variations: [
          { name: 'en-GB' },
          { name: 'nl-NL' },
          { name: 'fr-FR' },
          { name: 'demo', sharedEntry: 'en-GB' },
        ],
        transformIndex: (index, variation, fallback) => {
          const lang = fallback || variation === 'demo' ? 'en-GB' : variation;
          return index.replace('<html lang="en-GB">', `<html lang="${lang}">`);
        },
      },
    }),
  ],
};
