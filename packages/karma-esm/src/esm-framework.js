/* eslint-disable no-param-reassign */
function esmFramework(config, logger) {
  const log = logger.create('karma-esm');
  config.beforeMiddleware = config.beforeMiddleware || [];
  config.beforeMiddleware.push('esm');

  // karma only watches entrypoint test files
  // es-dev-server watches all files, so we disable karma's watch system
  config.files.forEach(file => {
    file.watched = false;
  });

  if (!config.files.some(file => file.type === 'module')) {
    log.warn('Config does not contain any test files with type="module"');
  }
}

esmFramework.$inject = ['config', 'logger'];

module.exports = esmFramework;
