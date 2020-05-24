import { transformAsync, TransformOptions } from '@babel/core';
import deepmerge from 'deepmerge';

interface CreateBabelTransformConfig {
  browserTarget: string | string[];
  polyfillModules?: boolean;
  readUserBabelConfig?: boolean;
  customBabelConfig?: TransformOptions;
}

export type BabelTransform = (filename: string, source: string) => Promise<string>;

export const defaultConfig: TransformOptions = {
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
 */
export function createBabelTransform(
  cfg: { readUserBabelConfig?: boolean; customBabelConfig?: TransformOptions },
  baseConfig?: TransformOptions,
) {
  const config = deepmerge.all<TransformOptions>([
    defaultConfig,
    baseConfig ?? {},
    {
      babelrc: !!cfg.readUserBabelConfig,
      // undefined is default behavior
      configFile: cfg.readUserBabelConfig ? undefined : false,
    },
    cfg.customBabelConfig ?? {},
  ]);

  return async function transform(filename: string, source: string) {
    const largeFile = source.length > 100000;
    const result = await transformAsync(source, {
      filename,
      // prevent generating pretty output for large files
      compact: largeFile,
      // babel runs out of memory when processing source maps andfor large files
      sourceMaps: !largeFile,
      ...config,
    });
    if (!result || !result.code) {
      throw new Error('Failed to transform');
    }
    return result.code;
  };
}

export function createCompatibilityBabelTransform(cfg: CreateBabelTransformConfig) {
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
          bugfixes: true,
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

export function createMinCompatibilityBabelTransform(cfg: Partial<CreateBabelTransformConfig>) {
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

export function createMaxCompatibilityBabelTransform(cfg: Partial<CreateBabelTransformConfig>) {
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
