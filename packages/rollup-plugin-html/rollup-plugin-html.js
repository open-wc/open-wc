/* eslint-disable no-param-reassign */
/** @typedef {import('parse5').Document} Document */
/** @typedef {import('rollup').Plugin} Plugin */
/** @typedef {import('rollup').InputOptions} InputOptions */
/** @typedef {import('rollup').OutputOptions} OutputOptions */
/** @typedef {import('rollup').OutputBundle} OutputBundle */
/** @typedef {import('rollup').OutputChunk} OutputChunk */
/** @typedef {import('rollup').EmittedFile} EmittedFile */
/** @typedef {import('./src/types').PluginOptions} PluginOptions */
/** @typedef {import('./src/types').InputHtmlData} InputHtmlData */
/** @typedef {import('./src/types').GeneratedBundle} GeneratedBundle */

const { getInputHtmlData } = require('./src/getInputHtmlData');
const { getEntrypointBundles } = require('./src/getEntrypointBundles');
const { getOutputHtml } = require('./src/getOutputHtml');
const { extractModules } = require('./src/extractModules');
const {
  createError,
  getMainOutputDir,
  addRollupInput,
  getOutputHtmlFileName,
} = require('./src/utils');

const watchMode = process.env.ROLLUP_WATCH === 'true';

/**
 * @param {PluginOptions} pluginOptions
 * @returns {Plugin & { addOutput: () => Plugin }}
 */
function rollupPluginHtml(pluginOptions) {
  pluginOptions = {
    inject: true,
    minify: !watchMode,
    ...(pluginOptions || {}),
  };

  let multiOutput = false;
  let outputCount = 0;
  /** @type {string} */
  let inputHtml;
  /** @type {string | undefined} */
  let inputHtmlName;
  /** @type {string[]} */
  let inputModuleIds;
  /** @type {Map<string, string>} */
  let inlineModules;
  /** @type {GeneratedBundle[]} */
  let generatedBundles;

  /**
   * @returns {Promise<EmittedFile>}
   */
  async function createHtmlAsset() {
    if (generatedBundles.length === 0) {
      throw createError('Cannot output HTML when no bundles have been generated');
    }

    const mainOutputDir = getMainOutputDir(pluginOptions, generatedBundles);
    const fileName = getOutputHtmlFileName(pluginOptions, inputHtmlName);

    const entrypointBundles = getEntrypointBundles({
      pluginOptions,
      generatedBundles,
      inputModuleIds,
      mainOutputDir,
      htmlFileName: fileName,
    });

    const outputHtml = await getOutputHtml({ pluginOptions, entrypointBundles, inputHtml });
    return {
      fileName,
      source: outputHtml,
      type: 'asset',
    };
  }

  return {
    name: 'rollup-plugin-html',

    /**
     * If an input HTML file is given, extracts modules and adds them as rollup
     * entrypoints.
     * @param {InputOptions} rollupInputOptions
     */
    options(rollupInputOptions) {
      if (!pluginOptions.inputHtml && !pluginOptions.inputPath) {
        return null;
      }

      const inputHtmlData = getInputHtmlData(pluginOptions);
      const inputHtmlResources = extractModules(inputHtmlData);
      inputHtmlName = inputHtmlData.name;
      inputHtml = inputHtmlResources.htmlWithoutModules;
      inlineModules = inputHtmlResources.inlineModules;

      inputModuleIds = [
        ...inputHtmlResources.moduleImports,
        ...inputHtmlResources.inlineModules.keys(),
      ];

      return addRollupInput(rollupInputOptions, inputModuleIds);
    },

    /**
     * Resets state whenever a build starts, since builds can restart in watch mode.
     * Watches input HTML for file reloads.
     */
    buildStart() {
      generatedBundles = [];

      if (pluginOptions.inputPath) {
        this.addWatchFile(pluginOptions.inputPath);
      }
    },

    resolveId(id) {
      if (!id.startsWith('inline-module-')) {
        return null;
      }

      if (!inlineModules.has(id)) {
        throw createError(`Could not find inline module: ${id}`);
      }

      return id;
    },

    /**
     * Loads inline modules extracted from HTML page
     * @param {string} id
     */
    load(id) {
      if (!id.startsWith('inline-module-')) {
        return null;
      }

      return inlineModules.get(id) || null;
    },

    /**
     * Emits output html file if we are doing a single output build.
     * @param {OutputOptions} options
     * @param {OutputBundle} bundle
     */
    async generateBundle(options, bundle) {
      if (multiOutput) return;
      generatedBundles.push({ options, bundle });
      this.emitFile(await createHtmlAsset());
    },

    /**
     * Creates a sub plugin for tracking multiple build outputs, generating a single index.html
     * file when both build outputs are finished.
     */
    addOutput() {
      multiOutput = true;
      outputCount += 1;

      return {
        name: `rollup-plugin-html-multi-output-${outputCount}`,

        /**
         * Stores output bundle, and emits output HTML file if all builds
         * for a multi build are finished.
         * @param {OutputOptions} options
         * @param {OutputBundle} bundle
         */
        async generateBundle(options, bundle) {
          generatedBundles.push({ options, bundle });
          if (generatedBundles.length === outputCount) {
            this.emitFile(await createHtmlAsset());
          }
        },
      };
    },
  };
}

module.exports = rollupPluginHtml;
