const path = require('path');
const createDefaultConfig = require('../../modern-and-legacy-config');

module.exports = createDefaultConfig({
  entry: [
    path.resolve(__dirname, './demo-app.js'),
    path.resolve(__dirname, './a/meta-url-test-2.js'),
  ],
  indexHTML: path.resolve(__dirname, './index.html'),
});
