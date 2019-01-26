const path = require('path');
const defaultConfig = require('../default-config');

module.exports = defaultConfig({
  indexHTML: path.resolve(__dirname, './index.html'),
  indexJS: path.resolve(__dirname, './index.js'),
});
