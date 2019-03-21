const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const createDefaultConfigs = require('../../modern-and-legacy-config');

const configs = createDefaultConfigs({
  entry: [
    path.resolve(__dirname, './demo-app.js'),
    path.resolve(__dirname, './a/meta-url-test-2.js'),
  ],
  indexHTML: path.resolve(__dirname, './index.html'),
});

module.exports = [
  merge(configs[0], {
    plugins: [new CopyWebpackPlugin(['demo/**/*.txt'])],
  }),
  configs[1],
];
