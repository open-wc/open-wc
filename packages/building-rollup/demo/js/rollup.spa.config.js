const merge = require('deepmerge');
const path = require('path');
const { createSpaConfig } = require('../../index.js');

const baseConfig = createSpaConfig({
  developmentMode: false,
  injectServiceWorker: true,
  outputDir: path.join(__dirname, '..', '..', 'dist'),
});

module.exports = merge(baseConfig, {
  input: require.resolve('./index.html'),
});
