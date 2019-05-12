const esm = require('./karma-esm');

/**
 * Karma preprocessor to handle compiling entry point test files.
 */

function karmaEsmPreprocessor(logger) {
  const log = logger.create('preprocessor.esm');

  function preprocess(code, file, done) {
    try {
      done(null, esm.compiler.compile(file.originalPath, code));
    } catch (e) {
      const message = `\n\n${e.message}\n at ${file.originalPath}\n\n`;
      log.error(message);
      done(null, code);
    }
  }

  return preprocess;
}

karmaEsmPreprocessor.$inject = ['logger'];

module.exports = karmaEsmPreprocessor;
