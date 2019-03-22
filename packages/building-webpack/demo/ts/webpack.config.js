const path = require('path');
const merge = require('webpack-merge');
const createDefaultConfig = require('../../modern-and-legacy-config');

const defaultConfig = createDefaultConfig({
  entry: path.resolve(__dirname, './demo-app.ts'),
  indexHTML: path.resolve(__dirname, './index.html'),
});

module.exports = defaultConfig.map(config =>
  merge(config, {
    module: {
      rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
    },
  }),
);
