const fs = require('fs');
const path = require('path');
const html = require('../../rollup-plugin-html');

const htmlIndex = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const htmlPageA = fs.readFileSync(path.join(__dirname, 'pages/page-a.html'), 'utf8');
const htmlPageB = fs.readFileSync(path.join(__dirname, 'pages/page-b.html'), 'utf8');
const htmlPageC = fs.readFileSync(path.join(__dirname, 'pages/page-c.html'), 'utf8');

module.exports = {
  output: {
    dir: './demo/dist',
  },
  plugins: [
    html({
      rootDir: __dirname,
      html: [
        // ..
        { name: 'index.html', html: htmlIndex },
        { name: 'pages/page-a.html', html: htmlPageA },
        { name: 'pages/page-b.html', html: htmlPageB },
        { name: 'pages/page-c.html', html: htmlPageC },
      ],
    }),
  ],
};
