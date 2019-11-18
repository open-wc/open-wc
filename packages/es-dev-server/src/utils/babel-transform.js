import { transformAsync } from '@babel/core';
import deepmerge from 'deepmerge';

// string length at which babel starts deoptimizing
const BABEL_DEOPTIMIZED_LENGTH = 500000;

/**
 * @typedef {object} CreateBabelTransformConfig
 * @property {string | string[]} [browserTarget]
 * @property {boolean} [polyfillModules]
 * @property {boolean} [readUserBabelConfig]
 * @property {object} [customBabelConfig]
 */

/** @typedef {(filename: string, source: string) => Promise<string>} BabelTransform  */

/**
 * Creates a babel compiler backed by an in-memory last-read-out cache. Sets up configuration
 * based on a number of presets.
 *
 * @returns {BabelTransform}
 */
export function createBabelTransform(babelConfig) {
  return async function transform(filename, source) {
    // babel runs out of memory when processing source maps for large files
    const sourceMaps = source.length > BABEL_DEOPTIMIZED_LENGTH ? false : 'inline';

    const result = await transformAsync(source, { filename, sourceMaps, ...babelConfig });
    return result.code;
  };
}

export const defaultConfig = {
  caller: {
    name: 'es-dev-server',
    supportsStaticESM: true,
  },
  /**
   * Enable syntax plugins for stage 3 features. This does **not** transform them,
   * it only ensures that babel does not crash when you're using them.
   */
  plugins: [
    require.resolve('@babel/plugin-syntax-import-meta'),
    require.resolve('@babel/plugin-syntax-class-properties'),
    require.resolve('@babel/plugin-syntax-nullish-coalescing-operator'),
    require.resolve('@babel/plugin-syntax-optional-chaining'),
    require.resolve('@babel/plugin-syntax-numeric-separator'),
  ],
  sourceType: 'module',
};

/**
 * @param {CreateBabelTransformConfig} cfg
 * @returns
 */
export function createCompatibilityBabelTransform(cfg) {
  const config = deepmerge(
    defaultConfig,
    {
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: Array.isArray(cfg.browserTarget) ? cfg.browserTarget : [cfg.browserTarget],
            useBuiltIns: false,
            shippedProposals: true,
            modules: false,
          },
        ],
      ],
      // only read the user's babelrc and config if explicitly enabled
      babelrc: cfg.readUserBabelConfig,
      configFile: cfg.readUserBabelConfig,
    },
    cfg.customBabelConfig,
  );

  return createBabelTransform(config);
}

/** @param {CreateBabelTransformConfig} cfg */
export function createMinCompatibilityBabelTransform(cfg) {
  return createCompatibilityBabelTransform({
    ...cfg,
    browserTarget: [
      'last 2 Chrome major versions',
      'last 2 ChromeAndroid major versions',
      'last 2 Firefox major versions',
      'last 2 Edge major versions',
      'last 2 Safari major versions',
      'last 2 iOS major versions',
    ],
  });
}

/** @param {CreateBabelTransformConfig} cfg */
export function createMaxCompatibilityBabelTransform(cfg) {
  return createCompatibilityBabelTransform({
    ...cfg,
    browserTarget: ['defaults', 'ie 10'],
  });
}

/**
 * config for only polyfilling modules, this should be run after the compatibility
 * config where all js is already compiled to a compatible format. we therefore don't
 * include any extra plugins or user configuration
 */
const polyfillModulesConfig = deepmerge(defaultConfig, {
  plugins: [
    require.resolve('@babel/plugin-proposal-dynamic-import'),
    require.resolve('@babel/plugin-transform-modules-systemjs'),
  ],
  babelrc: false,
  configFile: false,
});

export const polyfillModulesTransform = createBabelTransform(polyfillModulesConfig);
