const html = require('../../rollup-plugin-html');

module.exports = {
  input: '**/*.html',
  output: {
    dir: './demo/dist',
  },
  plugins: [html({ flatten: false, rootDir: './demo/mpa' })],
};
