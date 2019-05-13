/* eslint-disable no-param-reassign */
const KarmaEsmMiddleware = require('./middleware');
const karmaEsmPreprocessor = require('./preprocessor');
const { initialize } = require('./karma-esm');

/**
 * The karma esm framework. Helps the user debug the case where they don't have a
 * module test script defined, and boots up the plugin.
 */
function karmaEsmFramework(karmaConfig, karmaEmitter) {
  if (!karmaConfig.files.some(file => file.type === 'module')) {
    throw new Error(
      "Did not find any test files with type='module'." +
        "Follow this format: { pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' }",
    );
  }

  initialize(karmaConfig, karmaEmitter);
}

karmaEsmFramework.$inject = ['config', 'emitter'];

module.exports = {
  'framework:esm': ['factory', karmaEsmFramework],
  'middleware:esm': ['factory', KarmaEsmMiddleware],
  'preprocessor:esm': ['factory', karmaEsmPreprocessor],
};
