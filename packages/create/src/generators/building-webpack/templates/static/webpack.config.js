const path = require('path');
const { createDefaultConfig } = require('@open-wc/building-webpack');

// if you need to support IE11 use "modern-and-legacy-config" instead.
// const { createCompatibilityConfig } = require('@open-wc/building-webpack');
// module.exports = createCompatibilityConfig({
//   input: path.resolve(__dirname, './index.html'),
// });

module.exports = createDefaultConfig({
  input: path.resolve(__dirname, './index.html'),
});
