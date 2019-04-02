const path = require('path');
const merge = require('webpack-merge');
const createDefaultConfig = require('../../modern-and-legacy-config');

const defaultConfig = createDefaultConfig({
  input: path.resolve(__dirname, './index.html'),
});

module.exports = defaultConfig.map(config =>
  merge(config, {
    module: {
      rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
    },
  }),
);
