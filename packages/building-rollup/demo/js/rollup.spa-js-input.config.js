const merge = require('deepmerge');
const { createSpaConfig } = require('../../index.js');

const baseConfig = createSpaConfig({
  developmentMode: false,
  injectServiceWorker: true,
  swName: 'foo',
});

module.exports = merge(baseConfig, {
  input: './demo/js/demo-app.js',
});
