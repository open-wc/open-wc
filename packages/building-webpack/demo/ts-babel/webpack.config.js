const path = require('path');
const defaultConfig = require('../../modern-and-legacy-config');

module.exports = defaultConfig({
  entry: path.resolve(__dirname, './demo-app.ts'),
  indexHTML: path.resolve(__dirname, './index.html'),
});
