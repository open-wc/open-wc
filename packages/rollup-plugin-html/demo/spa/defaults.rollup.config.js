const resolve = require('@rollup/plugin-node-resolve');
const html = require('../../rollup-plugin-html');

module.exports = {
  input: 'demo/spa/src/my-app.js',
  output: {
    dir: './demo/dist',
  },
  plugins: [html({})],
};
