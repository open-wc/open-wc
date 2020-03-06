/* eslint-disable no-param-reassign */
/** @typedef {import ('@open-wc/rollup-plugin-html').RollupPluginHtml} RollupPluginHtml */
/** @typedef {import ('@open-wc/rollup-plugin-html').EntrypointBundle} EntrypointBundle */
/** @typedef {import('rollup').EmittedFile} EmittedFile */
/** @typedef {import('rollup').Plugin} Plugin */
/** @typedef {import('polyfills-loader').FileType} FileType */
/** @typedef {import('polyfills-loader').GeneratedFile} GeneratedFile */
/** @typedef {import('./src/types').PluginOptions} PluginOptions */

const { injectPolyfillsLoader } = require('polyfills-loader');
const { createError } = require('./src/utils');
const { createPolyfillsLoaderConfig } = require('./src/createPolyfillsLoaderConfig');

/**
 * @param {PluginOptions} pluginOptions
 * @returns {Plugin}
 */
function rollupPluginHtml(pluginOptions) {
  pluginOptions = {
    htmlFileName: 'index.html',
    ...(pluginOptions || {}),
  };
  /** @type {GeneratedFile[] | undefined} */
  let generatedFiles;

  return {
    name: '@open-wc/rollup-plugin-polyfills-loader',

    buildStart(options) {
      generatedFiles = undefined;

      if (!options.plugins) throw new Error('no plugins');
      const htmlPlugins = /** @type {RollupPluginHtml[]} */ (options.plugins.filter(
        p => p.name === '@open-wc/rollup-plugin-html',
      ));

      if (htmlPlugins.length === 0) {
        throw createError(
          'Could not find any instance of @open-wc/rollup-plugin-html in rollup build.',
        );
      }

      const htmlPlugin = htmlPlugins.find(
        pl => pl.getHtmlFileName() === pluginOptions.htmlFileName,
      );

      if (!htmlPlugin) {
        throw createError(
          `Could not find any instance of @open-wc/rollup-plugin-html that creates a file called ${pluginOptions.htmlFileName}.` +
            `Found filenames: ${htmlPlugins.map(p => p.getHtmlFileName()).join(', ')}`,
        );
      }

      htmlPlugin.addHtmlTransformer((html, { bundle, bundles }) => {
        const config = createPolyfillsLoaderConfig(pluginOptions, bundle, bundles);
        const { htmlString, polyfillFiles } = injectPolyfillsLoader(html, config);
        generatedFiles = polyfillFiles;

        return htmlString;
      });
    },

    generateBundle(_, bundle) {
      if (generatedFiles) {
        for (const file of generatedFiles) {
          // if the polyfills loader is used multiple times, this polyfill might already be output
          // so we guard against that. polyfills are already hashed, so there is no need to worry
          // about clashing
          if (!(file.path in bundle)) {
            this.emitFile({
              type: 'asset',
              name: file.path,
              fileName: file.path,
              source: file.content,
            });
          }
        }
      }
    },
  };
}

module.exports = rollupPluginHtml;
