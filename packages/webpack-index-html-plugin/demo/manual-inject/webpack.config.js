const path = require('path');

const WebpackIndexHTMLPlugin = require('../../webpack-index-html-plugin');

module.exports = {
  entry: path.resolve(__dirname, './app.js'),

  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
  },

  plugins: [
    new WebpackIndexHTMLPlugin({
      inject: false,
      template: ({ entries }) => `
      <html>
        <head>
          ${entries.map(entry => `<link rel="preload" href="${entry}" as="script">`).join('')}
        </head>
          <p>Template factory</p>
        <body>
          ${entries.map(entry => `<script type="module" src="${entry}"></script>`).join('')}
        </body>
      </html>
    `,
    }),
  ],
};
