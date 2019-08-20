import { transformAsync } from '@babel/core';
import deepmerge from 'deepmerge';
import { findSupportedBrowsers } from '@open-wc/building-utils';

// string length at which babel starts deoptimizing
const BABEL_DEOPTIMIZED_LENGTH = 500000;

/**
 * @typedef {object} CreateBabelCompilerConfig
 * @property {boolean} readUserBabelConfig
 * @property {boolean} modern
 * @property {object} [customBabelConfig]
 * @property {boolean} legacy
 * @property {boolean} [systemJs]
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
    highlightCode: false,
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

  return (filename, source) => {
    // babel runs out of memory when processing source maps for large files
    const sourceMaps = source.length > BABEL_DEOPTIMIZED_LENGTH ? false : 'inline';
    return transformAsync(source, { filename, sourceMaps, ...babelConfig }).then(
      result => result.code,
    );
  };
}
