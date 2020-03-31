const html = require('../../rollup-plugin-html');

module.exports = {
  output: {
    dir: './demo/dist',
  },
  plugins: [
    html({
      inputPath: './demo/mpa/index.html',
    }),
    html({
      inputPath: './demo/mpa/pages/page-a.html',
      name: 'pages/page-a.html',
    }),
    html({
      inputPath: './demo/mpa/pages/page-b.html',
      name: 'pages/page-b.html',
    }),
    html({
      inputPath: './demo/mpa/pages/page-c.html',
      name: 'pages/page-c.html',
    }),
  ],
};
