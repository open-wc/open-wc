const merge = require('deepmerge');
const commonjs = require('@rollup/plugin-commonjs');
const { createSpaConfig } = require('../../index.js');

const baseConfig = createSpaConfig({
  developmentMode: false,
  injectServiceWorker: false,
  legacyBuild: true,
});

module.exports = merge(baseConfig, {
  input: 'demo/cjs/index.html',
  plugins: [commonjs()],
});
