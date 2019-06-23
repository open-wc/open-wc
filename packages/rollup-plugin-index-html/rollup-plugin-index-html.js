const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { createEntrypoints } = require('./src/create-entrypoints');
const { createOutput } = require('./src/create-output');
const { createEntriesConfig } = require('./src/create-entries-config');
const { createError } = require('./src/utils');

/** @typedef {import('@open-wc/building-utils/index-html/create-index-html').EntriesConfig} EntriesConfig */

/**
 * @typedef {object} TemplateData
 * @property {EntriesConfig} entries
 * @property {EntriesConfig} [legacyEntries]
 */

/**
 * @typedef {object} RollupPluginIndexHTMLConfig
 * @property {(data: TemplateData) => string} [template]
 * @property {boolean} [legacy]
 * @property {boolean} [multiBuild]
 * @property {boolean} [inject]
 * @property {string} [legacyDir]
 * @property {string} [indexHTML]
 * @property {import('@open-wc/building-utils/index-html/create-index-html').PolyfillsConfig} [polyfills]
 * @property {false|object} [minify] minify configuration, or false to disable minification
 * @property {() => Promise<EntriesConfig>} [getLegacyFiles]
 * @property {(files: { path: string, content: string }[]) => void} [_outputHandler]
 */

/** @type {Partial<RollupPluginIndexHTMLConfig>} */
const defaultConfig = {
  inject: true,
  legacyDir: 'legacy',
  _outputHandler(files) {
    files.forEach(file => {
      mkdirp.sync(path.dirname(file.path));
      fs.writeFileSync(file.path, file.content, 'utf-8');
    });
  },
};

/** @type {EntriesConfig} */
let legacyEntries = null;

/**
 * @param {RollupPluginIndexHTMLConfig} pluginConfig
 */
module.exports = (pluginConfig = {}) => {
  const localPluginConfig = {
    ...defaultConfig,
    ...pluginConfig,
  };
  let outputIndexHTML;

  return {
    name: 'index-html',

    // Takes the configured index.html input, looks for all defined module scripts and feeds them to rollup.
    options(inputConfig) {
      // manual index.html, we don't need to parse anything
      if (pluginConfig.indexHTML) {
        if (typeof inputConfig.input === 'string' && inputConfig.input.endsWith('index.html')) {
          throw createError(
            'input cannot be an index.html when config.indexHTML was given manually',
          );
        }
        return inputConfig;
      }

      const result = createEntrypoints(inputConfig);
      ({ outputIndexHTML } = result);
      return result.rollupOptions;
    },

    // Injects generated module paths into index.html
    async generateBundle(outputConfig, bundles) {
      const entryFiles = Object.keys(bundles).filter(key => bundles[key].isEntry);
      const preloadedFiles = entryFiles.reduce((acc, e) => {
        bundles[e].imports.forEach(i => {
          if (!acc.includes(i)) {
            acc.push(i);
          }
        });
        return acc;
      }, []);

      if (localPluginConfig.multiBuild) {
        if (localPluginConfig.legacy) {
          // if this is a multi build, rollup is run twice in parallel. the legacy build
          // resolves a promise to signal the modern build which will create the index.html
          legacyEntries = createEntriesConfig(
            outputConfig,
            entryFiles,
            undefined,
            localPluginConfig.legacyDir,
          );
          return;
        }

        if (!legacyEntries) {
          throw createError(
            `Multi build is configured, but a legacy build did not run. Pass two configs to rollup, where the first is a legacy and the second is a modern build.`,
          );
        }
      }

      const entries = createEntriesConfig(outputConfig, entryFiles, preloadedFiles);
      const files = createOutput(
        localPluginConfig,
        outputConfig,
        outputIndexHTML,
        entries,
        legacyEntries,
      );

      localPluginConfig._outputHandler(files);
      legacyEntries = null;
    },
  };
};
