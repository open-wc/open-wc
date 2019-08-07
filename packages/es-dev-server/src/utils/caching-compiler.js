import LRUCache from 'lru-cache';

/**
 * @typedef {object} CacheEntry
 * @property {String} code
 * @property {string} lastModified
 */

/**
 * Creates a compiler backed by an in-memory last-read-out cache.
 *
 * @param {(filePath: string, source: string) => Promise<string>} compile
 */
export function createCachingCompiler(compile) {
  /** @type {import('lru-cache')<string, CacheEntry>} */
  const cache = new LRUCache({
    length: (n, key) => n.lastModified.length + n.code.length + key.length,
    max: 52428800,
  });
  /** @type {Map<string, Promise<string>>} */
  const compileTasks = new Map();

  /**
   * Compiles code and stores the result
   *
   * @param {string} filePath the file being compiled
   * @param {string} sourceCode the origin source code
   * @param {string} lastModified last time the file was modified on the filesystem, used for caching
   * @returns {Promise<string>}
   */
  async function cachingCompile(filePath, sourceCode, lastModified) {
    // check for currently running compile tasks to avoid race conditions, for example when
    // multiple browser instances request the same module
    const existingCompileTask = compileTasks.get(filePath);
    if (existingCompileTask) {
      return existingCompileTask;
    }

    const compileTask = compile(filePath, sourceCode);

    compileTasks.set(filePath, compileTask);

    try {
      const compiledCode = await compileTask;
      // cache result for later
      cache.set(filePath, { code: compiledCode, lastModified });
      return compiledCode;
    } catch (error) {
      throw error;
    } finally {
      compileTasks.delete(filePath);
    }
  }

  /**
   * Returns cached babel compilation result if we have one for the given file, and if it didn't change
   * in the meantime.
   *
   * @param {string} filePath
   * @returns {string | undefined}
   */
  function getFromCache(filePath, lastModified) {
    const cacheEntry = cache.get(filePath);
    if (cacheEntry && cacheEntry.lastModified === lastModified) {
      return cacheEntry.code;
    }
    return undefined;
  }

  return {
    compile: cachingCompile,
    getFromCache,
  };
}
