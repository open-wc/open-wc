const defaultConfig = require('../../default-storybook-webpack-config.js');

module.exports = ({ config }) => {
  return defaultConfig({ config, transpilePackages: ['lit-html', 'lit-element', '@open-wc'] });
};
