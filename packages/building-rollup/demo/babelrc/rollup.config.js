const merge = require('deepmerge');
const { createSpaConfig } = require('../../index.js');

const baseConfig = createSpaConfig({
  developmentMode: false,
});

module.exports = merge(baseConfig, {
  input: 'demo/babelrc/index.html',
});
