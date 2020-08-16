/** @typedef {import('rollup').EmittedFile} EmittedFile */
/** @typedef {import('./types').HtmlFile} HtmlFile */
/** @typedef {import('./types').PluginOptions} PluginOptions */
/** @typedef {import('./types').GeneratedBundle} GeneratedBundle */
/** @typedef {import('./types').TransformFunction} TransformFunction */

const { getEntrypointBundles } = require('./getEntrypointBundles');
const { getOutputHtml } = require('./getOutputHtml');
const { createError } = require('./utils');

/**
 * @param {string} mainOutputDir
 * @param {HtmlFile} data
 * @param {Object} opts Options
 * @param {GeneratedBundle[]} opts.generatedBundles
 * @param {TransformFunction[]} opts.externalTransformFns
 * @param {PluginOptions} opts.pluginOptions
 * @returns {Promise<EmittedFile>}
 */
async function createHtmlAsset(
  mainOutputDir,
  { inputModuleIds, htmlFileName, html },
  { generatedBundles, externalTransformFns, pluginOptions },
) {
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
    html,
    externalTransformFns,
    htmlFileName,
  });
  return {
    fileName: htmlFileName,
    source: outputHtml,
    type: 'asset',
  };
}

/**
 * @param {string} mainOutputDir
 * @param {Object} opts Options
 * @param {GeneratedBundle[]} opts.generatedBundles
 * @param {TransformFunction[]} opts.externalTransformFns
 * @param {PluginOptions} opts.pluginOptions
 * @param {HtmlFile[]} opts.htmlFiles
 * @returns {Promise<EmittedFile[]>}
 */
async function createHtmlAssets(
  mainOutputDir,
  { generatedBundles, externalTransformFns, pluginOptions, htmlFiles },
) {
  const assets = [];
  for (const htmlAsset of htmlFiles) {
    assets.push(
      // eslint-disable-next-line no-await-in-loop
      await createHtmlAsset(mainOutputDir, htmlAsset, {
        generatedBundles,
        externalTransformFns,
        pluginOptions,
      }),
    );
  }
  return assets;
}

module.exports = {
  createHtmlAsset,
  createHtmlAssets,
};
