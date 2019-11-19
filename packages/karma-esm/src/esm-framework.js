/* eslint-disable no-param-reassign */
function esmFramework(config) {
  config.beforeMiddleware = config.beforeMiddleware || [];
  config.beforeMiddleware.push('esm');

  // karma only watches entrypoint test files
  // es-dev-server watches all files, so we disable karma's watch system
  config.files.forEach(file => {
    file.watched = false;
  });
}

module.exports = esmFramework;
