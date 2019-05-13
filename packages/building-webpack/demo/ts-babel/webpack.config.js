const path = require('path');
const defaultConfig = require('../../modern-and-legacy-config');

module.exports = defaultConfig({
  input: path.resolve(__dirname, './index.html'),
});
