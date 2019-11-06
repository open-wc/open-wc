// @ts-nocheck

const path = require('path');

const defaultWorboxConfig = {
  navigateFallback: '/index.html',
  // where to output the generated sw
  swDest: path.join(process.cwd(), 'dist', 'sw.js'),
  // directory to match patterns against to be precached
  globDirectory: path.join(process.cwd(), 'dist'),
  // cache any html js and css by default
  globPatterns: ['**/*.{html,js,css}'],
};

module.exports = function getWorkboxConfig() {
  const workboxConfigPath = path.join(process.cwd(), 'workbox-config.js');

  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(workboxConfigPath);
  } catch (error) {
    return defaultWorboxConfig;
  }
};
