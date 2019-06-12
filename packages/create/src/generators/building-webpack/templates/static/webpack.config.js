const { resolve } = require('path');	const path = require('path');
const createDefaultConfig = require('@open-wc/building-webpack/modern-and-legacy-config');	const createDefaultConfig = require('@open-wc/building-webpack/modern-config');


 // If you don't need IE11 support, use the modern-config instead	// if you need to support IE11 use "modern-and-legacy-config" instead.
// import createDefaultConfig from '@open-wc/building-webpack/modern-config';	// const createDefaultConfig = require('@open-wc/building-webpack/modern-and-legacy-config');


 module.exports = createDefaultConfig({	module.exports = createDefaultConfig({
  input: resolve(__dirname, './index.html'),	  input: path.resolve(__dirname, './index.html'),
});
