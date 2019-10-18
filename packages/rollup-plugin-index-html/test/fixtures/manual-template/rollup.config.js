const path = require('path');
const indexHTML = require('../../../rollup-plugin-index-html');

module.exports = config => ({
  input: path.resolve(__dirname, './index.html'),
  output: {
    dir: '',
    format: 'esm',
  },
  plugins: [
    indexHTML({
      ...config,
      inject: false,
      template: ({ entries }) => `
        <html>
          <head>
            ${entries.files
              .map(entry => `<link rel="preload" href="${entry}" as="script">`)
              .join('')}
          </head>
            <p>Template factory</p>
          <body>
            ${entries.files.map(entry => `<script type="module" src="${entry}"></script>`).join('')}
          </body>
        </html>
      `,
    }),
  ],
});
