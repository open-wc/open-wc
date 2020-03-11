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
/** @typedef {import('./src/types').TransformFunction} TransformFunction */
/** @typedef {import('./src/types').RollupPluginHtml} RollupPluginHtml */
/** @typedef {import('./src/types').EntrypointBundle} EntrypointBundle */
/** @typedef {import('./src/types').TransformArgs} TransformArgs */

const { getInputHtmlData } = require('./src/getInputHtmlData');
const { getEntrypointBundles } = require('./src/getEntrypointBundles');
const { getOutputHtml } = require('./src/getOutputHtml');
const { extractModules } = require('./src/extractModules');
const {
  createError,
  getMainOutputDir,
  addRollupInput,
  shouldReadInputFromRollup,
} = require('./src/utils');

const watchMode = process.env.ROLLUP_WATCH === 'true';
const defaultFileName = 'index.html';

/**
 * @param {PluginOptions} pluginOptions
 * @returns {RollupPluginHtml}
 */
function rollupPluginHtml(pluginOptions) {
  pluginOptions = {
    inject: true,
    minify: !watchMode,
    ...(pluginOptions || {}),
  };

  /** @type {string[]} */
  const multiOutputNames = [];
  let multiOutput = false;
  let outputCount = 0;
  /** @type {string} */
  let inputHtml;
  /** @type {string[]} */
  let inputModuleIds;
  /** @type {Map<string, string>} */
  let inlineModules;
  /** @type {string} */
  let htmlFileName;
  /** @type {GeneratedBundle[]} */
  let generatedBundles;
  /** @type {TransformFunction[]} */
  let externalTransformFns = [];

  /**
   * @returns {Promise<EmittedFile>}
   */
  async function createHtmlAsset() {
    if (generatedBundles.length === 0) {
      throw createError('Cannot output HTML when no bundles have been generated');
    }

    const mainOutputDir = getMainOutputDir(pluginOptions, generatedBundles);

    const entrypointBundles = getEntrypointBundles({
      pluginOptions,
      generatedBundles,
      inputModuleIds,
      mainOutputDir,
      htmlFileName,
    });

    const outputHtml = await getOutputHtml({
      pluginOptions,
      entrypointBundles,
      inputHtml,
      externalTransformFns,
    });
    return {
      fileName: htmlFileName,
      source: outputHtml,
      type: 'asset',
    };
  }

  return {
    name: '@open-wc/rollup-plugin-html',

    /**
     * If an input HTML file is given, extracts modules and adds them as rollup
     * entrypoints.
     * @param {InputOptions} rollupInputOptions
     */
    options(rollupInputOptions) {
      let rollupInput;
      if (shouldReadInputFromRollup(rollupInputOptions, pluginOptions)) {
        rollupInput = /** @type {string} */ (rollupInputOptions.input);
      }

      if (!pluginOptions.inputHtml && !pluginOptions.inputPath && !rollupInput) {
        htmlFileName = pluginOptions.name || defaultFileName;
        return null;
      }

      const inputHtmlData = getInputHtmlData(pluginOptions, rollupInput);
      htmlFileName = pluginOptions.name || inputHtmlData.name || defaultFileName;
      const inputHtmlResources = extractModules(inputHtmlData, htmlFileName);
      inputHtml = inputHtmlResources.htmlWithoutModules;
      inlineModules = inputHtmlResources.inlineModules;

      inputModuleIds = [
        ...inputHtmlResources.moduleImports,
        ...inputHtmlResources.inlineModules.keys(),
      ];

      if (rollupInput) {
        // we are taking input from the rollup input, we should replace the html from the input
        return { ...rollupInputOptions, input: inputModuleIds };
      } // we need to add modules to existing rollup input
      return addRollupInput(rollupInputOptions, inputModuleIds);
    },

    /**
     * Resets state whenever a build starts, since builds can restart in watch mode.
     * Watches input HTML for file reloads.
     */
    buildStart() {
      generatedBundles = [];
      externalTransformFns = [];

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
      generatedBundles.push({ name: 'default', options, bundle });
      this.emitFile(await createHtmlAsset());
    },

    getHtmlFileName() {
      return htmlFileName;
    },

    /**
     * @param {TransformFunction} transformFunction
     */
    addHtmlTransformer(transformFunction) {
      externalTransformFns.push(transformFunction);
    },

    /**
     * Creates a sub plugin for tracking multiple build outputs, generating a single index.html
     * file when both build outputs are finished.
     *
     * @param {string} name
     */
    addOutput(name) {
      if (!name || multiOutputNames.includes(name)) {
        throw createError('Each output must have a unique name');
      }
      multiOutputNames.push(name);

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
          generatedBundles.push({ name, options, bundle });
          if (generatedBundles.length === outputCount) {
            this.emitFile(await createHtmlAsset());
          }
        },
      };
    },
  };
}

module.exports = rollupPluginHtml;
