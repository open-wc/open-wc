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
      html: [
        // ..
        { name: 'index.html', html: htmlIndex, rootDir: path.join(__dirname) },
        { name: 'pages/page-a.html', html: htmlPageA, rootDir: path.join(__dirname, 'pages') },
        { name: 'pages/page-b.html', html: htmlPageB, rootDir: path.join(__dirname, 'pages') },
        { name: 'pages/page-c.html', html: htmlPageC, rootDir: path.join(__dirname, 'pages') },
      ],
    }),
  ],
};
