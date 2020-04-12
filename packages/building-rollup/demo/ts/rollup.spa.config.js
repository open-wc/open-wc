const merge = require('deepmerge');
const typescript = require('@rollup/plugin-typescript');
const { createSpaConfig } = require('../../index.js');

const baseConfig = createSpaConfig({
  developmentMode: false,
  injectServiceWorker: false,
  legacyBuild: true,
});

module.exports = merge(baseConfig, {
  input: 'demo/ts/index.html',
  plugins: [typescript({ experimentalDecorators: true, target: 'es2019' })],
});
