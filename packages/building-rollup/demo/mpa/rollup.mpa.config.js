const merge = require('deepmerge');
const { createMpaConfig } = require('../../index.js');

const baseConfig = createMpaConfig({
  developmentMode: true,
  injectServiceWorker: true,
  rootDir: 'demo/mpa',
});

module.exports = merge(baseConfig, {
  input: '**/*.html',
});
