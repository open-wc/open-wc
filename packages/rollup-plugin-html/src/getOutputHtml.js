/* eslint-disable no-await-in-loop */

/** @typedef {import('./types').PluginOptions} PluginOptions */
/** @typedef {import('./types').EntrypointBundle} EntrypointBundle */
/** @typedef {import('./types').TransformFunction} TransformFunction */

const { injectBundles } = require('./injectBundles');
const { minifyHtml } = require('./minifyHtml');

const defaultHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>';

/**
 * @param {object} args
 * @param {PluginOptions} args.pluginOptions
 * @param {Record<string, EntrypointBundle>} args.entrypointBundles
 * @param {TransformFunction[]} [args.externalTransformFns]
 * @param {string | undefined} [args.html]
 * @param {string | undefined} [args.htmlFileName]
 */
async function getOutputHtml({
  pluginOptions,
  entrypointBundles,
  externalTransformFns,
  html,
  htmlFileName,
}) {
  const { template, inject, minify } = pluginOptions;
  let outputHtml;

  const { default: defaultBundle, ...multiBundles } = entrypointBundles;

  if (typeof template === 'string') {
    outputHtml = template;
  } else if (typeof template === 'function') {
    outputHtml = await template({
      html,
      inputHtml: html, // for backwards compatibility
      bundle: defaultBundle,
      bundles: multiBundles,
    });
  } else if (html) {
    outputHtml = html;
  } else {
    outputHtml = defaultHtml;
  }

  // inject build output into HTML
  if (inject) {
    outputHtml = injectBundles(outputHtml, entrypointBundles);
  }

  // transform HTML output
  const transforms = [...(externalTransformFns || [])];
  if (pluginOptions.transform) {
    if (Array.isArray(pluginOptions.transform)) {
      transforms.push(...pluginOptions.transform);
    } else {
      transforms.push(pluginOptions.transform);
    }
  }
  for (const transform of transforms) {
    outputHtml = await transform(outputHtml, {
      bundle: defaultBundle,
      bundles: multiBundles,
      htmlFileName,
    });
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
