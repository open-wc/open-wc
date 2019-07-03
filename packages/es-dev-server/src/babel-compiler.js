import { transformAsync } from '@babel/core';
import deepmerge from 'deepmerge';
import LRUCache from 'lru-cache';
import { findSupportedBrowsers } from '@open-wc/building-utils';

/**
 * @typedef {object} CreateBabelCompilerConfig
 * @property {boolean} readUserBabelConfig
 * @property {string} rootDir
 * @property {string[]} moduleDirectories
 * @property {boolean} nodeResolve
 * @property {boolean} modern
 * @property {boolean} legacy
 */

/** @param {boolean} babelrc */
function createDefaultConfig(babelrc) {
  return {
    caller: {
      name: 'es-dev-server',
      supportsStaticESM: true,
    },
    plugins: [
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('@babel/plugin-syntax-import-meta'),
    ],
    sourceType: 'module',
    // only read the user's babelrc if explicitly enabled
    babelrc,
    sourceMap: 'inline',
  };
}

/**
 * @param {string} rootBaseDir
 * @param {string[]} moduleDirectories
 */
function createNodeResolveConfig(rootBaseDir, moduleDirectories) {
  return {
    plugins: [
      [
        require.resolve('@open-wc/building-utils/forked-babel-plugin-bare-import-rewrite'),
        {
          rootBaseDir,
          alwaysRootImport: ['**'],
          modulesDir: './node_modules',
          failOnUnresolved: true,
          moduleDirectories,
        },
      ],
    ],
  };
}

const modernConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: findSupportedBrowsers(),
        useBuiltIns: false,
        modules: false,
      },
    ],
  ],
};

const legacyConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: ['ie 11'],
        useBuiltIns: false,
        modules: 'systemjs',
      },
    ],
  ],
};

/**
 * @typedef {object} CacheEntry
 * @property {String} code
 * @property {string} lastModified
 */

/**
 * Creates a babel compiler backed by an in-memory last-read-out cache. Sets up configuration
 * based on a number of presets.
 *
 * @param {CreateBabelCompilerConfig} cfg
 */
export default function createBabelCompiler(cfg) {
  // create babel configuration based on a number of presets
  const babelConfigs = [
    createDefaultConfig(cfg.readUserBabelConfig),
    cfg.nodeResolve && createNodeResolveConfig(cfg.rootDir, cfg.moduleDirectories),
    cfg.modern && modernConfig,
    cfg.legacy && legacyConfig,
  ].filter(Boolean);

  const babelConfig = deepmerge.all(babelConfigs);

  /** @type {import('lru-cache')<string, CacheEntry>} */
  const cache = new LRUCache({
    length: (n, key) => n.lastModified.length + n.code.length + key.length,
    max: 52428800,
  });
  /** @type {Map<string, Promise<{ code: string }>>} */
  const compileTasks = new Map();

  /**
   * Compiles code and stores the result
   *
   * @param {string} filename the file being compiled
   * @param {string} sourceCode the origin source code
   * @param {string} lastModified last time the file was modified on the filesystem, used for caching
   * @returns {Promise<string>}
   */
  async function compile(filename, sourceCode, lastModified) {
    // check for currently running compile tasks to avoid race conditions, for example when
    // multiple browser instances request the same module
    const existingCompileTask = compileTasks.get(filename);
    if (existingCompileTask) {
      return (await existingCompileTask).code;
    }

    const compileTask = transformAsync(sourceCode, { filename, ...babelConfig });

    compileTasks.set(filename, compileTask);

    try {
      const { code: compiledCode } = await compileTask;
      // cache result for later
      cache.set(filename, { code: compiledCode, lastModified });
      return compiledCode;
    } catch (error) {
      throw error;
    } finally {
      compileTasks.delete(filename);
    }
  }

  /**
   * Returns cached babel compilation result if we have one for the given file, and if it didn't change
   * in the meantime.
   *
   * @param {string} filename
   * @returns {string | undefined}
   */
  function getFromCache(filename, lastModified) {
    const cacheEntry = cache.get(filename);
    if (cacheEntry && cacheEntry.lastModified === lastModified) {
      return cacheEntry.code;
    }
    return undefined;
  }

  return {
    compile,
    getFromCache,
  };
}
