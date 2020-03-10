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
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('@babel/plugin-syntax-import-meta'),
    require.resolve('@babel/plugin-syntax-class-properties'),
    require.resolve('@babel/plugin-syntax-numeric-separator'),
  ],
  sourceType: 'module',
};

/**
 * Creates a babel compiler backed by an in-memory last-read-out cache. Sets up configuration
 * based on a number of presets.
 *
 * @param {CreateBabelTransformConfig} cfg
 * @param {object} [baseConfig]
 */
export function createBabelTransform(cfg, baseConfig) {
  const config = deepmerge.all([
    defaultConfig,
    baseConfig || {},
    // @ts-ignore
    {
      babelrc: cfg.readUserBabelConfig,
      configFile: cfg.readUserBabelConfig,
    },
    cfg.customBabelConfig || {},
  ]);

  return async function transform(filename, source) {
    // babel runs out of memory when processing source maps for large files
    const sourceMaps = source.length > BABEL_DEOPTIMIZED_LENGTH ? false : 'inline';

    const result = await transformAsync(source, { filename, sourceMaps, ...config });
    return result.code;
  };
}

/**
 * @param {CreateBabelTransformConfig} cfg
 * @returns
 */
export function createCompatibilityBabelTransform(cfg) {
  return createBabelTransform(cfg, {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: Array.isArray(cfg.browserTarget) ? cfg.browserTarget : [cfg.browserTarget],
          exclude: [
            // included below in loose mode
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator',
          ],
          useBuiltIns: false,
          shippedProposals: true,
          modules: false,
        },
      ],
    ],
    plugins: [
      // loose mode saves a lot of extra generated code
      [require.resolve('@babel/plugin-proposal-optional-chaining'), { loose: true }],
      [require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), { loose: true }],
    ],
  });
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
 * transform for only polyfilling modules, this should be run after the compatibility
 * config where all js is already compiled to a compatible format. we therefore don't
 * include any extra plugins or user configuration
 */
export const polyfillModulesTransform = createBabelTransform(
  {},
  {
    plugins: [
      require.resolve('@babel/plugin-proposal-dynamic-import'),
      require.resolve('@babel/plugin-transform-modules-systemjs'),
      // systemjs adds template literals, we do systemjs after (potential)
      // es5 compilation so we need to ensure it stays es5
      require.resolve('@babel/plugin-transform-template-literals'),
    ],
    babelrc: false,
    configFile: false,
  },
);
