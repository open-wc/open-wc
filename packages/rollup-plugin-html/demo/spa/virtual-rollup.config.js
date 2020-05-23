const html = require('../../rollup-plugin-html');

module.exports = {
  output: {
    dir: './demo/dist',
  },
  plugins: [
    html({
      inputHtml: '<script type="module" src="./demo/spa/src/my-app.js"></script>',
    }),
  ],
};
