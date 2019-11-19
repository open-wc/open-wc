const path = require('path');
const deepmerge = require('deepmerge');

/**
 * @typedef {object} KarmaEsmConfig
 * @property {boolean} nodeResolve
 * @property {boolean} coverage
 * @property {string[]} coverageExclude
 * @property {object} babelConfig
 * @property {string} [compatibility]
 * @property {string[]} [moduleDirs]
 * @property {Function[]} [middlewares]
 * @property {boolean} [babel]
 * @property {string[]} [fileExtensions]
 * @property {string[]} [exclude]
 * @property {string[]} [babelExclude]
 * @property {string[]} [babelModernExclude]
 * @property {string[]} [babelModuleExclude]
 * @property {boolean} [preserveSymlinks]
 * @property {Partial<import('@open-wc/building-utils/index-html/create-index-html').PolyfillsConfig>} polyfills
 */

function createEsmConfig(karmaConfig) {
  /** @type {KarmaEsmConfig} */
  const esmConfig = karmaConfig.esm || {};

  if (!esmConfig.exclude) {
    esmConfig.exclude = [];
  }

  // the option used to be called `customBabelConfig`, remain backwards compatible for now
  // @ts-ignore
  let babelConfig = esmConfig.babelConfig || esmConfig.customBabelConfig;

  esmConfig.middlewares = [
    ...(esmConfig.middlewares || []),
    async function log404(ctx, next) {
      await next();
      if (ctx.status === 404 && path.extname(ctx.url)) {
        console.warn(`[karma-esm]: Could not find requested file: ${ctx.url}`); // eslint-disable-line no-console
      }
    },
  ];

  // exclude regular test scripts/libs from babel
  const karmaLibs = karmaConfig.files
    .filter(f => f.pattern.endsWith('.js') && f.type !== 'module')
    .map(f => f.pattern);

  esmConfig.babelExclude = [...(esmConfig.babelExclude || []), ...karmaLibs];
  esmConfig.babelModuleExclude = [...(esmConfig.babelModuleExclude || []), ...karmaLibs];

  if (esmConfig.coverage) {
    const coverageExclude = [
      '**/node_modules/**',
      '**/test/**',
      '**/spec/**',
      '**/demo/**',
      '**/stories/**',
      '**/inline-module-*',
      ...(esmConfig.coverageExclude || []),
    ];

    // if we are only running babel for coverage, exclude none-instrumented
    // files from babel to save computation time
    if (!babelConfig && !esmConfig.babel) {
      esmConfig.babelModernExclude = [...(esmConfig.babelModernExclude || []), ...coverageExclude];
    }

    babelConfig = deepmerge(
      {
        plugins: [
          [
            require.resolve('babel-plugin-istanbul'),
            {
              exclude: coverageExclude,
            },
          ],
        ],
      },
      babelConfig || {},
    );
  }

  return {
    esmConfig,
    babelConfig,
  };
}

module.exports = {
  createEsmConfig,
};
