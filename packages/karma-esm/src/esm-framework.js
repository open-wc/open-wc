/* eslint-disable no-param-reassign */
const path = require('path');

function esmFramework(config) {
  config.beforeMiddleware = config.beforeMiddleware || [];
  config.beforeMiddleware.push('esm');
  config.customDebugFile = path.resolve(__dirname, 'esm-debug.html');
  config.customContextFile = path.resolve(__dirname, 'esm-context.html');

  // karma only watches entrypoint test files
  // es-dev-server watches all files, so we disable karma's watch system
  config.files.forEach(file => {
    file.watched = false;
  });
}

module.exports = esmFramework;
