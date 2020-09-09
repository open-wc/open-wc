/* eslint-disable no-param-reassign */
/** @typedef {import ('@open-wc/rollup-plugin-html').RollupPluginHtml} RollupPluginHtml */
/** @typedef {import ('@open-wc/rollup-plugin-html').EntrypointBundle} EntrypointBundle */
/** @typedef {import('rollup').EmittedFile} EmittedFile */
/** @typedef {import('rollup').Plugin} Plugin */
/** @typedef {import('polyfills-loader').FileType} FileType */
/** @typedef {import('polyfills-loader').GeneratedFile} GeneratedFile */
/** @typedef {import('./src/types').PluginOptions} PluginOptions */

const path = require('path');
const { injectPolyfillsLoader } = require('polyfills-loader');
const { createError, shouldInjectLoader } = require('./src/utils');
const { createPolyfillsLoaderConfig } = require('./src/createPolyfillsLoaderConfig');

/**
 * @param {PluginOptions} [pluginOptions]
 * @returns {Plugin}
 */
function rollupPluginPolyfillsLoader(pluginOptions = {}) {
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

      const htmlPlugin =
        htmlPlugins.length === 1
          ? htmlPlugins[0]
          : htmlPlugins.find(pl => pl.getHtmlFileName() === pluginOptions.htmlFileName);

      if (!htmlPlugin) {
        throw createError(
          `Could not find any instance of @open-wc/rollup-plugin-html that creates a file called ${pluginOptions.htmlFileName}.` +
            `Found filenames: ${htmlPlugins.map(p => p.getHtmlFileName()).join(', ')}`,
        );
      }

      htmlPlugin.addHtmlTransformer(async (html, { bundle, bundles }) => {
        const config = createPolyfillsLoaderConfig(pluginOptions, bundle, bundles);
        let htmlString = html;

        if (shouldInjectLoader(config)) {
          const result = await injectPolyfillsLoader(html, config);
          htmlString = result.htmlString;
          generatedFiles = result.polyfillFiles;
        } else {
          // we don't need to inject a polyfills loader, so we just inject the scripts directly
          const scripts = config.modern.files
            .map(f => `<script type="module" src="${f.path}"></script>\n`)
            .join('');
          htmlString = htmlString.replace('</body>', `\n${scripts}\n</body>`);
        }

        // preload all entrypoints as well as their direct dependencies
        const { entrypoints } = pluginOptions.modernOutput
          ? bundles[pluginOptions.modernOutput.name]
          : bundle;

        let preloaded = [];
        for (const entrypoint of entrypoints) {
          preloaded.push(entrypoint.importPath);

          // js files (incl. chunks) will always be in the root directory
          const pathToRoot = path.posix.relative('./', path.posix.dirname(entrypoint.importPath));
          for (const chunkPath of entrypoint.chunk.imports) {
            preloaded.push(path.posix.join(pathToRoot, chunkPath));
          }
        }
        preloaded = [...new Set(preloaded)];

        return htmlString.replace(
          '</head>',
          `\n${preloaded
            .map(i => `<link rel="preload" href="${i}" as="script" crossorigin="anonymous">\n`)
            .join('')}</head>`,
        );
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

module.exports = rollupPluginPolyfillsLoader;
