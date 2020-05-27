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
const { extractModules } = require('./src/extractModules');
const { createError, addRollupInput, shouldReadInputFromRollup } = require('./src/utils');
const { createHtmlAsset, createHtmlAssets } = require('./src/createHtmlAssets');

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
  let generatedBundles;
  /** @type {TransformFunction[]} */
  let externalTransformFns = [];
  /** @type {HtmlFile[]}  */
  const htmlFiles = [];
  /** @type {string} */
  let fakeModuleForPureHtmlInput = '';

  // variables for multi build
  /** @type {string[]} */
  const multiOutputNames = [];
  // function emit asset, used when the outputName option is
  // used to explicitly configure which output build to emit
  // assets from
  /** @type {Function} */
  let deferredEmitHtmlFile;

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
        /** @deprecated - use html or files instead */

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
        htmlFiles.push({
          html,
          inputModuleIds,
          htmlFileName,
          inlineModules,
        });
      }
      /** @type {string[]} */
      let inputModuleIds = [];
      for (const htmlFile of htmlFiles) {
        inputModuleIds = [...inputModuleIds, ...htmlFile.inputModuleIds];
      }

      if (inputModuleIds.length === 0) {
        fakeModuleForPureHtmlInput = 'fake-module-for-pure-html-input.js';
        inputModuleIds.push(fakeModuleForPureHtmlInput);
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
      generatedBundles = [];
      externalTransformFns = [];

      if (pluginOptions.inputPath) {
        this.addWatchFile(pluginOptions.inputPath);
      }
    },

    resolveId(id) {
      for (const file of htmlFiles) {
        if (file.inlineModules && file.inlineModules.has(id)) {
          return id;
        }
      }
      if (id === fakeModuleForPureHtmlInput) {
        return fakeModuleForPureHtmlInput;
      }
      return null;
    },

    /**
     * Loads inline modules extracted from HTML page
     * @param {string} id
     */
    load(id) {
      for (const file of htmlFiles) {
        if (file.inlineModules && file.inlineModules.has(id)) {
          return file.inlineModules.get(id);
        }
      }
      if (id === fakeModuleForPureHtmlInput) {
        return 'export const doNothing = true; // I am here to allow pure html inputs for rollup';
      }
      return null;
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

      const assets = await createHtmlAssets(options.dir, {
        htmlFiles,
        generatedBundles,
        externalTransformFns,
        pluginOptions,
      });
      if (assets.length > 0) {
        for (const asset of assets) {
          this.emitFile(asset);
        }
      } else {
        const htmlFileName = pluginOptions.name || defaultFileName;
        this.emitFile(
          await createHtmlAsset(
            options.dir,
            { htmlFileName },
            { generatedBundles, externalTransformFns, pluginOptions },
          ),
        );
      }
    },

    /**
     * @deprecated use getHtmlFileNames instead
     */
    getHtmlFileName() {
      if (htmlFiles.length > 1) {
        throw createError(
          'Using getHtmlFileName is not possible when having multiple html files. Use getHtmlFileNames instead.',
        );
      }
      if (htmlFiles.length === 0) {
        return pluginOptions.name || defaultFileName;
      }
      return htmlFiles[0].htmlFileName;
    },

    getHtmlFileNames() {
      if (htmlFiles.length === 0) {
        if (pluginOptions.name) {
          return [pluginOptions.name];
        }
        return [defaultFileName];
      }
      return htmlFiles.map(htmlFile => htmlFile.htmlFileName);
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
                  createHtmlAssets(dir, {
                    htmlFiles,
                    generatedBundles,
                    externalTransformFns,
                    pluginOptions,
                  }).then(assets => {
                    for (const asset of assets) {
                      this.emitFile(asset);
                    }
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
              createHtmlAssets(options.dir, {
                htmlFiles,
                generatedBundles,
                externalTransformFns,
                pluginOptions,
              }).then(assets => {
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
