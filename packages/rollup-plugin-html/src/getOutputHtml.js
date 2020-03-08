/* eslint-disable no-await-in-loop */

/** @typedef {import('./types').PluginOptions} PluginOptions */
/** @typedef {import('./types').EntrypointBundle} EntrypointBundle */

const { injectBundles } = require('./injectBundles');
const { minifyHtml } = require('./minifyHtml');

const defaultHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>';

/**
 * @param {object} args
 * @param {PluginOptions} args.pluginOptions
 * @param {EntrypointBundle[]} args.entrypointBundles
 * @param {string | undefined} [args.inputHtml]
 */
async function getOutputHtml({ pluginOptions, entrypointBundles, inputHtml }) {
  const { template, inject, minify } = pluginOptions;
  let outputHtml;

  if (typeof template === 'string') {
    outputHtml = template;
  } else if (typeof template === 'function') {
    outputHtml = await template({
      inputHtml,
      bundle: entrypointBundles[0],
      bundles: entrypointBundles,
    });
  } else if (inputHtml) {
    outputHtml = inputHtml;
  } else {
    outputHtml = defaultHtml;
  }

  // inject build output into HTML
  if (inject) {
    outputHtml = injectBundles(outputHtml, entrypointBundles);
  }

  // transform HTML output
  if (pluginOptions.transform) {
    const transforms = Array.isArray(pluginOptions.transform)
      ? pluginOptions.transform
      : [pluginOptions.transform];

    for (const transform of transforms) {
      outputHtml = await transform(outputHtml, {
        bundle: entrypointBundles[0],
        bundles: entrypointBundles,
      });
    }
  }

  // minify final HTML output
  if (minify) {
    if (typeof minify === 'function') {
      outputHtml = await minify(outputHtml);
    } else if (typeof minify === 'object') {
      outputHtml = minifyHtml(outputHtml, minify);
    } else {
      outputHtml = minifyHtml(outputHtml);
    }
  }

  return outputHtml;
}

module.exports = { getOutputHtml };
