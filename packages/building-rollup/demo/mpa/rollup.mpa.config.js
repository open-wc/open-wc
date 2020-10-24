const merge = require('deepmerge');
const path = require('path');
const { createMpaConfig } = require('../../index.js');

const baseConfig = createMpaConfig({
  developmentMode: true,
  injectServiceWorker: true,
  rootDir: __dirname,
  outputDir: path.join(__dirname, '..', '..', 'dist'),
});

module.exports = merge(baseConfig, {
  input: '**/*.html',
});
