const path = require('path');
const indexHTML = require('../../../rollup-plugin-index-html');

module.exports = config => ({
  input: path.resolve(__dirname, './app.js'),
  output: {
    dir: '',
    format: 'esm',
  },
  plugins: [
    indexHTML({
      ...config,
      indexHTML: path.join(__dirname, 'index.html'),
    }),
  ],
});
