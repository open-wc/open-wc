const html = require('../../rollup-plugin-html');

module.exports = {
  output: {
    dir: './demo/dist',
  },
  plugins: [
    html({
      inputPath: './demo/spa/index.html',
    }),
  ],
};
