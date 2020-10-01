/* eslint-disable class-methods-use-this, no-param-reassign */
const deepmerge = require('deepmerge');
const { createEntrypoints } = require('./src/create-entrypoints');
const { emitIndexHTML } = require('./src/emit-index-html');
const { PLUGIN_NAME, createError, createDeferredPromise, waitOrTimeout } = require('./src/utils');

/**
 * @typedef {object} VariationConfig
 * @property {string} name the name of this variation
 * @property {string} [sharedEntry] if an entry should be shared, this variation
 *   will not create a new entrypoint but share it with another variation
 */

/**
 * @typedef {object} MultiIndexConfig
 * @property {string} [fallback]
 * @property {VariationConfig[]} variations
 * @property {(index: string, variation: string, fallback: boolean) => string} [transformIndex]
 */

/**
 * @typedef {object} TemplateData
 * @property {object[]} assets
 * @property {string[]} entries
 * @property {string[]} legacyEntries[]
 * @property {string} variation
 */

/**
 * @typedef {object} WebpackIndexHTMLPluginConfig
 * @property {(data: TemplateData) => string} template
 * @property {MultiIndexConfig} [multiIndex]
 * @property {boolean} [legacy]
 * @property {boolean} [multiBuild]
 * @property {boolean} [inject]
 * @property {string} [legacyDir]
 * @property {number} [legacyTimeout]
 * @property {import('@open-wc/building-utils/index-html/create-index-html').PolyfillsConfig} [polyfills]
 * @property {false|object} [minify] minify configuration, or false to disable minification
 * @property {string} [loader]
 */

/**
 * @typedef {object} BuildResult
 * @property {string[]} entries
 * @property {Map<string, string[]>} entryNamesForVariations
 */

/** @type {import('./src/utils').DeferredPromise<BuildResult> | null} */
let deferredLegacyBuildResult = null;

const defaultConfig = {
  legacyDir: 'legacy',
  inject: true,
};

class WebpackIndexHTMLPlugin {
  /**
   * @param {Partial<WebpackIndexHTMLPluginConfig>} config
   */
  constructor(config = {}) {
    this._config = deepmerge(defaultConfig, config);

    if (config.multiIndex) {
      if (!Array.isArray(config.multiIndex.variations)) {
        throw createError('Missing an array of variations at multiIndex.variations.');
      }

      if (config.multiIndex.variations.some(v => !v.name)) {
        throw createError(`Some variations are missing a name property.`);
      }
    }
  }

  apply(compiler) {
    /** @type {string[]} */
    let entries;
    /** @type {Map<string, string[]> | null} */
    let entryNamesForVariations = null;
    let baseIndex;

    /**
     * If there is no user-defined template for the index.html we are expecting the entrypoint to be a index.html and we
     * will extract the js entrypoints from the index.html and use that index.html as the template for the output.
     *
     * If there is a user defined template, we will use that as template for the output.
     */
    if (!this._config.template) {
      compiler.hooks.entryOption.tap(PLUGIN_NAME, (context, entry) => {
        const result = createEntrypoints(compiler, context, entry, this._config, createError);
        ({ entryNamesForVariations, baseIndex } = result);
        return false;
      });
    }

    compiler.hooks.beforeCompile.tap(PLUGIN_NAME, () => {
      if (this._config.multiBuild && this._config.legacy) {
        deferredLegacyBuildResult = createDeferredPromise();
      }
      this.emitted = false;
      entries = [];
    });

    compiler.hooks.emit.tapPromise(PLUGIN_NAME, async compilation => {
      // only emit once for performance
      if (this.emitted) {
        return;
      }

      compilation.entrypoints.forEach(entrypoint => {
        const jsFiles = entrypoint.getRuntimeChunk().files.filter(f => f.endsWith('.js'));
        entries.push(...jsFiles);
      });

      if (this._config.multiBuild) {
        if (this._config.legacy) {
          deferredLegacyBuildResult.resolve({ entries, entryNamesForVariations });
          return;
        }
      }

      if (this._config.multiBuild) {
        const legacyBuildResult = await waitOrTimeout(
          deferredLegacyBuildResult.promise,
          600000,
          'Legacy build did not finish within 600000 ms.',
        );

        emitIndexHTML(
          compilation,
          this._config,
          { entries, entryNamesForVariations },
          legacyBuildResult,
          baseIndex,
        );
      } else {
        emitIndexHTML(
          compilation,
          this._config,
          { entries, entryNamesForVariations },
          undefined,
          baseIndex,
        );
      }
      this.emitted = true;
      deferredLegacyBuildResult = null;
      entryNamesForVariations = null;
    });
  }
}

module.exports = WebpackIndexHTMLPlugin;
