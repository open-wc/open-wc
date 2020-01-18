const babel = require('@babel/core');
const minimatch = require('minimatch');
const chokidar = require('chokidar');
const LRUCache = require('lru-cache');

/**
 * @typedef {object} CompilerConfig
 * @property {object} options options to pass to babel
 * @property {string[]} [exclude] files to exclude from compilation
 */

/**
 * Creates a babel compiler backed by a cache.
 * @param {CompilerConfig} config
 */
function createCompiler(config, fileWatcher = chokidar.watch([])) {
  const cache = new LRUCache({
    length: (n, key) => n.length + key.length,
    max: 52428800,
  });

  fileWatcher.on('change', filePath => {
    cache.del(filePath);
  });

  /**
   * @param {string} filePath
   * @param {string} code
   */
  function addToCache(filePath, code) {
    cache.set(filePath, code);

    fileWatcher.add(filePath);
  }

  /**
   * @param {string} filePath
   * @param {string} code
   * @returns {string}
   */
  function babelCompile(filePath, code) {
    return babel.transform(code, {
      filename: filePath,
      ...config.options,
      // @ts-ignore
    }).code;
  }

  /**
   * Compiles given code at the given filepath. If getFromCache is true, returns the cached
   * compiled code.
   *
   * @param {string} filePath
   * @param {string} code
   * @param {boolean} checkCache
   * @returns {string}
   */
  function compile(filePath, code, checkCache = true) {
    if (checkCache) {
      const cachedCode = cache.get(filePath);
      if (cachedCode) {
        return cachedCode;
      }
    }

    // if we should not babel compile some files, only add them to the cache
    if (config.exclude) {
      if (config.exclude.some(exclude => minimatch(filePath, exclude))) {
        addToCache(filePath, code);
        return code;
      }
    }

    const compiled = babelCompile(filePath, code);
    addToCache(filePath, compiled);
    return compiled;
  }

  /**
   * @param {string} filePath
   * @returns {string}
   */
  function getFromCache(filePath) {
    return cache.get(filePath);
  }

  function clearCache() {
    cache.reset();
  }

  return {
    fileWatcher,
    compile,
    getFromCache,
    clearCache,
  };
}

module.exports = createCompiler;
