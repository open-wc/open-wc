import { transformAsync } from '@babel/core';
import deepmerge from 'deepmerge';
import { findSupportedBrowsers } from '@open-wc/building-utils';
import { createCachingCompiler } from './caching-compiler.js';

/**
 * @typedef {object} CreateBabelCompilerConfig
 * @property {boolean} readUserBabelConfig
 * @property {string} rootDir
 * @property {string[]} moduleDirectories
 * @property {boolean} modern
 * @property {object} [customBabelConfig]
 * @property {boolean} legacy
 * @property {string[]} [extraFileExtensions]
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
    // custom babel config if it's there
    createDefaultConfig(cfg.readUserBabelConfig),
    cfg.modern && modernConfig,
    cfg.legacy && legacyConfig,
    cfg.customBabelConfig,
  ].filter(Boolean);

  const babelConfig = deepmerge.all(babelConfigs);

  return createCachingCompiler((filename, source) =>
    transformAsync(source, { filename, ...babelConfig }).then(result => result.code),
  );
}
