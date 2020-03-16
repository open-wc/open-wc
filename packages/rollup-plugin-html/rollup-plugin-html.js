/* eslint-disable no-param-reassign */
/** @typedef {import('parse5').Document} Document */
/** @typedef {import('rollup').Plugin} Plugin */
/** @typedef {import('rollup').InputOptions} InputOptions */
/** @typedef {import('rollup').OutputOptions} OutputOptions */
/** @typedef {import('rollup').OutputBundle} OutputBundle */
/** @typedef {import('rollup').OutputChunk} OutputChunk */
/** @typedef {import('rollup').EmittedFile} EmittedFile */
/** @typedef {import('rollup').EmitFile} EmitFile */
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
const { createError, addRollupInput, shouldReadInputFromRollup } = require('./src/utils');

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

  // variables for multi build
  /** @type {string[]} */
  const multiOutputNames = [];
  // function emit asset, used when the outputName option is
  // used to explicitly configure which output build to emit
  // assets from
  /** @type {Function} */
  let deferredEmitHtmlFile;

  /**
   * @param {string} mainOutputDir
   * @returns {Promise<EmittedFile>}
   */
  async function createHtmlAsset(mainOutputDir) {
    if (generatedBundles.length === 0) {
      throw createError('Cannot output HTML when no bundles have been generated');
    }

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
      if (!inlineModules || !inlineModules.has(id)) {
        return null;
      }

      return id;
    },

    /**
     * Loads inline modules extracted from HTML page
     * @param {string} id
     */
    load(id) {
      return (inlineModules && inlineModules.get(id)) || null;
    },

    /**
     * Emits output html file if we are doing a single output build.
     * @param {OutputOptions} options
     * @param {OutputBundle} bundle
     */
    async generateBundle(options, bundle) {
      if (multiOutputNames.length !== 0) return;
      if (!options.dir) {
        throw createError('Output must have a dir option set.');
      }
      generatedBundles.push({ name: 'default', options, bundle });
      this.emitFile(await createHtmlAsset(options.dir));
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

      return {
        name: `rollup-plugin-html-multi-output-${multiOutputNames.length}`,

        /**
         * Stores output bundle, and emits output HTML file if all builds
         * for a multi build are finished.
         * @param {OutputOptions} options
         * @param {OutputBundle} bundle
         */
        async generateBundle(options, bundle) {
          return new Promise(resolve => {
            if (!options.dir) {
              throw createError(`Output ${name} must have a dir option set.`);
            }

            generatedBundles.push({ name, options, bundle });

            if (pluginOptions.outputBundleName) {
              if (!multiOutputNames.includes(pluginOptions.outputBundleName)) {
                throw createError(
                  `outputName is set to ${pluginOptions.outputBundleName} but there was no ` +
                    "output added with this name. Used .addOutput('name') to add it.",
                );
              }

              if (pluginOptions.outputBundleName === name) {
                // we need to emit the asset from this output's asset tree, but not all build outputs have
                // finished building yet. create a function to be called later to emit the final output
                // when all builds are finished
                const { dir } = options;
                deferredEmitHtmlFile = () =>
                  createHtmlAsset(dir).then(asset => {
                    this.emitFile(asset);
                    resolve();
                  });
              }
            }

            if (generatedBundles.length === multiOutputNames.length) {
              // this is the last build, emit the HTML file
              if (deferredEmitHtmlFile) {
                // emit to another build output's asset tree
                deferredEmitHtmlFile().then(() => {
                  resolve();
                });
                return;
              }

              const outputDirs = new Set(generatedBundles.map(b => b.options.dir));
              if (outputDirs.size !== 1) {
                throw createError(
                  `Multiple rollup build outputs have a different output directory set.` +
                    ' Set the outputName property to indicate which build should be used to emit the generated HTML file.',
                );
              }

              // emit asset from this output
              createHtmlAsset(options.dir).then(asset => {
                resolve();
                this.emitFile(asset);
              });
              return;
            }

            // no work to be done for this build output
            resolve();
          });
        },
      };
    },
  };
}

module.exports = rollupPluginHtml;
