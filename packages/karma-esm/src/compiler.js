const createBabelCompiler = require('@open-wc/building-utils/cached-babel-compiler');

/**
 * Sets up karma-esm compiler. Compiles files with babel, maintains
 * a cache and notifies karma when files change.
 */
function createCompiler(config, karmaEmitter) {
  const babelCompiler = createBabelCompiler(config.babel);
  babelCompiler.fileWatcher.on('change', filePath => {
    if (!filePath.endsWith('.test.js') && !filePath.endsWith('.spec.js')) {
      karmaEmitter.refreshFiles();
    }
  });

  return babelCompiler;
}

module.exports = createCompiler;
