const { resolve } = require('path');
const createDefaultConfig = require('@open-wc/building-webpack/modern-and-legacy-config');

// If you don't need IE11 support, use the modern-config instead
// import createDefaultConfig from '@open-wc/building-webpack/modern-config';

module.exports = createDefaultConfig({
  input: resolve(__dirname, './src/index.html'),
});
