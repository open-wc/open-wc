const esm = require('./src/karma-esm');

function karmaEsmPreprocessor(logger) {
  const log = logger.create('preprocessor.esm');

  function preprocess(content, file, done) {
    try {
      const processed = esm.compile(file.originalPath, content);
      done(null, processed);
    } catch (e) {
      const message = `\n\n${e.message}\n at ${file.originalPath}\n\n`;
      log.error(message);
      done(null, content);
    }
  }

  return preprocess;
}

karmaEsmPreprocessor.$inject = ['logger'];

module.exports = karmaEsmPreprocessor;
