const babel = require('@babel/core');
const minimatch = require('minimatch');
const chokidar = require('chokidar');

/**
 * Sets up karma-esm compiler. Compiles files with babel, maintains
 * a cache and notifies karma when files change.
 */
function createCompiler(config, karmaEmitter) {
  const cache = new Map();
  const watcher = chokidar.watch([]);

  watcher.on('change', filePath => {
    if (!filePath.endsWith('.test.js') && !filePath.endsWith('.spec.js')) {
      karmaEmitter.refreshFiles();
    }
    cache.delete(filePath);
  });

  function addToCache(filePath, code) {
    cache.set(filePath, code);
    watcher.add(filePath);
  }

  function babelCompile(filePath, code) {
    return babel.transform(code, {
      filename: filePath,
      ...config.babelOptions,
    }).code;
  }

  function compile(filePath, code) {
    // if we should not babel compile some files, only add them to the cache
    if (config.babel && config.babel.exclude) {
      if (config.babel.exclude.some(exclude => minimatch(filePath, exclude))) {
        addToCache(filePath, code);
        return code;
      }
    }

    const compiled = babelCompile(filePath, code);
    addToCache(filePath, compiled);
    return compiled;
  }

  function getCached(filePath) {
    return cache.get(filePath);
  }

  return {
    compile,
    getCached,
  };
}

module.exports = createCompiler;
