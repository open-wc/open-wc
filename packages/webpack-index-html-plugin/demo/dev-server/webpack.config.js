const defaultConfig = require('../single-entry/webpack.config');

module.exports = {
  ...defaultConfig,
  devServer: {
    contentBase: process.cwd(),
    compress: true,
    port: 8080,
    historyApiFallback: true,
    stats: {
      stats: 'errors-only',
    },
  },
};
