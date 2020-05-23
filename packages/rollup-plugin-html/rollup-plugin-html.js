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
/** @typedef {import('./src/types').GeneratedBundle} GeneratedBundle */
/** @typedef {import('./src/types').TransformFunction} TransformFunction */
/** @typedef {import('./src/types').RollupPluginHtml} RollupPluginHtml */
/** @typedef {import('./src/types').EntrypointBundle} EntrypointBundle */
/** @typedef {import('./src/types').TransformArgs} TransformArgs */
/** @typedef {import('./src/types').HtmlFile} HtmlFile */

const path = require('path');
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
    flatten: true,
    minify: !watchMode,
    rootDir: process.cwd(),
    ...(pluginOptions || {}),
  };

  pluginOptions.rootDir = path.resolve(pluginOptions.rootDir);

  /** @type {GeneratedBundle[]} */
  let thisGeneratedBundles;
  /** @type {TransformFunction[]} */
  let thisExternalTransformFns = [];
  /** @type {HtmlFile[]}  */
  const thisHtmlFiles = [];

  // variables for multi build
  /** @type {string[]} */
  const thisMultiOutputNames = [];
  // function emit asset, used when the outputName option is
  // used to explicitly configure which output build to emit
  // assets from
  /** @type {Function} */
  let deferredEmitHtmlFile;

  /**
   * @param {string} mainOutputDir
   * @param {HtmlFile} data
   * @returns {Promise<EmittedFile>}
   */
  async function createHtmlAsset(mainOutputDir, { inputModuleIds, htmlFileName, html }) {
    if (thisGeneratedBundles.length === 0) {
      throw createError('Cannot output HTML when no bundles have been generated');
    }

    const entrypointBundles = getEntrypointBundles({
      pluginOptions,
      generatedBundles: thisGeneratedBundles,
      inputModuleIds,
      mainOutputDir,
      htmlFileName,
    });

    const outputHtml = await getOutputHtml({
      pluginOptions,
      entrypointBundles,
      html,
      externalTransformFns: thisExternalTransformFns,
    });
    return {
      fileName: htmlFileName,
      source: outputHtml,
      type: 'asset',
    };
  }

  /**
   * @param {string} mainOutputDir
   */
  async function createHtmlAssets(mainOutputDir) {
    const assets = [];
    for (const htmlAsset of thisHtmlFiles) {
      // eslint-disable-next-line no-await-in-loop
      assets.push(await createHtmlAsset(mainOutputDir, htmlAsset));
    }
    return assets;
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

      if (!pluginOptions.html && !pluginOptions.files && !rollupInput) {
        // @deprecated - backwards compatibility
        if (!pluginOptions.inputHtml && !pluginOptions.inputPath) {
          return null;
        }
      }
      const htmlDataArray = getInputHtmlData(pluginOptions, rollupInput);
      for (const htmlData of htmlDataArray) {
        const htmlFileName = pluginOptions.name || htmlData.name || defaultFileName;
        const inputHtmlResources = extractModules(htmlData, htmlFileName);
        const html = inputHtmlResources.htmlWithoutModules;
        const { inlineModules } = inputHtmlResources;

        const inputModuleIds = [
          ...inputHtmlResources.moduleImports,
          ...inputHtmlResources.inlineModules.keys(),
        ];
        thisHtmlFiles.push({
          html,
          inputModuleIds,
          htmlFileName,
          inlineModules,
        });
      }
      /** @type {string[]} */
      let inputModuleIds = [];
      for (const htmlFile of thisHtmlFiles) {
        inputModuleIds = [...inputModuleIds, ...htmlFile.inputModuleIds];
      }

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
      thisGeneratedBundles = [];
      thisExternalTransformFns = [];

      if (pluginOptions.inputPath) {
        this.addWatchFile(pluginOptions.inputPath);
      }
    },

    resolveId(id) {
      for (const file of thisHtmlFiles) {
        if (file.inlineModules && file.inlineModules.has(id)) {
          return id;
        }
      }
      return null;
    },

    /**
     * Loads inline modules extracted from HTML page
     * @param {string} id
     */
    load(id) {
      for (const file of thisHtmlFiles) {
        if (file.inlineModules && file.inlineModules.has(id)) {
          return file.inlineModules.get(id);
        }
      }
      return null;
    },

    /**
     * Emits output html file if we are doing a single output build.
     * @param {OutputOptions} options
     * @param {OutputBundle} bundle
     */
    async generateBundle(options, bundle) {
      if (thisMultiOutputNames.length !== 0) return;
      if (!options.dir) {
        throw createError('Output must have a dir option set.');
      }
      thisGeneratedBundles.push({ name: 'default', options, bundle });

      const assets = await createHtmlAssets(options.dir);
      if (assets.length > 0) {
        for (const asset of assets) {
          this.emitFile(asset);
        }
      } else {
        const htmlFileName = pluginOptions.name || defaultFileName;
        this.emitFile(await createHtmlAsset(options.dir, { htmlFileName }));
      }
      // this.emitFile(await createHtmlAsset(options.dir));

      // const htmlFileName = pluginOptions.name || defaultFileName;
      // this.emitFile(await createHtmlAsset(options.dir, { htmlFileName }));
    },

    /**
     * @deprecated use getHtmlFileNames instead
     */
    getHtmlFileName() {
      if (thisHtmlFiles.length > 1) {
        throw createError(
          'Using getHtmlFileName is not possible when having multiple html files. Use getHtmlFileNames instead.',
        );
      }
      if (thisHtmlFiles.length === 0) {
        return pluginOptions.name || defaultFileName;
      }
      return thisHtmlFiles[0].htmlFileName;
    },

    getHtmlFileNames() {
      if (thisHtmlFiles.length === 0) {
        if (pluginOptions.name) {
          return [pluginOptions.name];
        }
        return [defaultFileName];
      }
      return thisHtmlFiles.map(htmlFile => htmlFile.htmlFileName);
    },

    /**
     * @param {TransformFunction} transformFunction
     */
    addHtmlTransformer(transformFunction) {
      thisExternalTransformFns.push(transformFunction);
    },

    /**
     * Creates a sub plugin for tracking multiple build outputs, generating a single index.html
     * file when both build outputs are finished.
     *
     * @param {string} name
     */
    addOutput(name) {
      if (!name || thisMultiOutputNames.includes(name)) {
        throw createError('Each output must have a unique name');
      }

      thisMultiOutputNames.push(name);

      return {
        name: `rollup-plugin-html-multi-output-${thisMultiOutputNames.length}`,

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

            thisGeneratedBundles.push({ name, options, bundle });

            if (pluginOptions.outputBundleName) {
              if (!thisMultiOutputNames.includes(pluginOptions.outputBundleName)) {
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
                  createHtmlAssets(dir).then(assets => {
                    for (const asset of assets) {
                      this.emitFile(asset);
                    }
                    resolve();
                  });
              }
            }

            if (thisGeneratedBundles.length === thisMultiOutputNames.length) {
              // this is the last build, emit the HTML file
              if (deferredEmitHtmlFile) {
                // emit to another build output's asset tree
                deferredEmitHtmlFile().then(() => {
                  resolve();
                });
                return;
              }

              const outputDirs = new Set(thisGeneratedBundles.map(b => b.options.dir));
              if (outputDirs.size !== 1) {
                throw createError(
                  `Multiple rollup build outputs have a different output directory set.` +
                    ' Set the outputName property to indicate which build should be used to emit the generated HTML file.',
                );
              }

              // emit asset from this output
              createHtmlAssets(options.dir).then(assets => {
                resolve();
                for (const asset of assets) {
                  this.emitFile(asset);
                }
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
