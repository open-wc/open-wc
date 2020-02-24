// @ts-nocheck

const path = require('path');

module.exports = function getWorkboxConfig(outputDir) {
  const workboxConfigPath = path.join(process.cwd(), 'workbox-config.js');
  const defaultWorboxConfig = {
    globIgnores: ['/legacy/*.js'],
    navigateFallback: '/index.html',
    // where to output the generated sw
    swDest: path.join(process.cwd(), outputDir, 'sw.js'),
    // directory to match patterns against to be precached
    globDirectory: path.join(process.cwd(), outputDir),
    // cache any html js and css by default
    globPatterns: ['**/*.{html,js,css}'],
  };

  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(workboxConfigPath);
  } catch (error) {
    return defaultWorboxConfig;
  }
};
