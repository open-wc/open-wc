const path = require('path');
const fs = require('fs');
const deepmerge = require('deepmerge');
const { compatibilityModes } = require('es-dev-server/dist/constants.js');
const { modernPolyfills, legacyPolyfills } = require('es-dev-server/dist/utils/polyfills.js');
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
 * @property {object} customBabelConfig
 * @property {string} [compatibility]
 * @property {string[]} [moduleDirectories]
 * @property {Function[]} [customMiddlewares]
 * @property {boolean} [babel]
 * @property {string[]} [fileExtensions]
 * @property {string} [importMap]
 * @property {string[]} [babelExclude]
 * @property {string[]} [exclude]
 * @property {string[]} [babelModernExclude]
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
  let { customBabelConfig } = esmConfig;

  if (esmConfig.coverage) {
    customBabelConfig = deepmerge(
      {
        plugins: [
          [
            require.resolve('babel-plugin-istanbul'),
            {
              exclude: [
                '**/node_modules/**',
                '**/test/**',
                '**/spec/**',
                '**/demo/**',
                '**/stories/**',
                ...(esmConfig.coverageExclude || []),
              ],
            },
          ],
        ],
      },
      customBabelConfig || {},
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
    customBabelConfig,
  };
}

module.exports = {
  createEsmConfig,
};
