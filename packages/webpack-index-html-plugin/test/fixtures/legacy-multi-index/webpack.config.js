const path = require('path');
const WebpackIndexHTMLPlugin = require('../../../webpack-index-html-plugin');

module.exports = [
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
        multiIndex: {
          variations: [{ name: 'en-GB' }, { name: 'nl-NL' }, { name: 'fr-FR' }],
        },
      }),
    ],
  },
  {
    entry: path.resolve(__dirname, './index.html'),

    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js',
    },

    plugins: [
      new WebpackIndexHTMLPlugin({
        multiBuild: true,
        polyfills: {
          coreJs: true,
          webcomponents: true,
        },
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
  },
];
