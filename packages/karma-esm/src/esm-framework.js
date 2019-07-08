/* eslint-disable no-param-reassign */
const path = require('path');

function esmFramework(config) {
  config.beforeMiddleware = config.beforeMiddleware || [];
  config.beforeMiddleware.push('esm');
  config.customDebugFile = path.resolve(__dirname, 'esm-debug.html');
  config.customContextFile = path.resolve(__dirname, 'esm-context.html');
}

module.exports = esmFramework;
