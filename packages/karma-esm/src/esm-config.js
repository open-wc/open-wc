const path = require('path');
const fs = require('fs');
const deepmerge = require('deepmerge');
const { compatibilityModes, modernPolyfills, legacyPolyfills } = require('es-dev-server');
const { getPolyfills } = require('@open-wc/building-utils/index-html/polyfills.js');
const { createTestLoaderBrowserScript } = require('./test-loader-browser-script');

const polyfillPresets = {
  [compatibilityModes.NONE]: null,
  [compatibilityModes.ESM]: modernPolyfills,
  [compatibilityModes.MODERN]: modernPolyfills,
  [compatibilityModes.ALL]: legacyPolyfills,
};

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
 * @property {string} [importMap]
 * @property {string[]} [exclude]
 * @property {string[]} [babelExclude]
 * @property {string[]} [babelModernExclude]
 * @property {boolean} [preserveSymlinks]
 * @property {Partial<import('@open-wc/building-utils/index-html/create-index-html').PolyfillsConfig>} polyfills
 */

function createEsmConfig(karmaConfig) {
  /** @type {KarmaEsmConfig} */
  const esmConfig = karmaConfig.esm || {};
  /** @type {object | null} */
  let importMap = null;

  if (!esmConfig.exclude) {
    esmConfig.exclude = [];
  }

  if (esmConfig.importMap) {
    const importMapPath = path.resolve(esmConfig.importMap);
    if (!fs.existsSync(importMapPath) || !fs.statSync(importMapPath).isFile()) {
      throw new Error(`Did not find any import map at ${importMapPath}`);
    }

    importMap = JSON.parse(fs.readFileSync(importMapPath, 'utf-8'));
  }

  const polyfillsPreset = esmConfig.compatibility ? polyfillPresets[esmConfig.compatibility] : null;

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

  if (esmConfig.coverage) {
    const coverageExclude = [
      '**/node_modules/**',
      '**/test/**',
      '**/spec/**',
      '**/demo/**',
      '**/stories/**',
      ...(esmConfig.coverageExclude || []),
    ];

    // if we are only running babel for coverage, exclude none-instrumented
    // files from babel to save computation time
    if (
      !babelConfig &&
      !esmConfig.babel &&
      (!esmConfig.compatibility || esmConfig.compatibility === compatibilityModes.NONE)
    ) {
      esmConfig.babelModernExclude = coverageExclude;
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

  // @ts-ignore
  const polyfills = getPolyfills({
    entries: { type: 'module', files: [] },
    legacyEntries: { type: 'system', files: [] },
    // @ts-ignore
    polyfills: deepmerge({}, polyfillsPreset || {}, esmConfig.polyfills || {}),
  });

  const testLoaderBrowserScript = createTestLoaderBrowserScript(
    esmConfig.compatibility,
    polyfills,
    importMap,
  );

  return {
    esmConfig,
    polyfills,
    testLoaderBrowserScript,
    babelConfig,
  };
}

module.exports = {
  createEsmConfig,
};
