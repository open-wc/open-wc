const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const createDefaultConfig = require('../../modern-config');

const defaultConfig = createDefaultConfig({
  entry: path.resolve(__dirname, './demo-app.js'),
  indexHTML: path.resolve(__dirname, './index.html'),
});

module.exports = merge(defaultConfig, {
  plugins: [new CopyWebpackPlugin(['demo/**/*.txt'])],
});
