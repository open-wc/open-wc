/** @typedef {import('./types').EntrypointBundle} EntrypointBundle */
/** @typedef {import('rollup').ModuleFormat} ModuleFormat */

const { parse, serialize } = require('parse5');
const { createScript } = require('@open-wc/building-utils');
const { query, predicates, append } = require('@open-wc/building-utils/dom5-fork');
const { createError } = require('./utils');

/**
 * @param {string} src
 * @param {ModuleFormat} format
 */
function createLoadScript(src, format) {
  if (['es', 'esm', 'module'].includes(format)) {
    return createScript({ type: 'module', src });
  }

  if (['system', 'systemjs'].includes(format)) {
    return createScript({}, `System.import(${JSON.stringify(src)});`);
  }

  return createScript({ src, defer: '' });
}

/**
 * @param {string} htmlString
 * @param {EntrypointBundle[]} entrypointBundles
 * @returns {string}
 */
function injectBundles(htmlString, entrypointBundles) {
  const documentAst = parse(htmlString);
  const body = query(documentAst, predicates.hasTagName('body'));

  for (const { options, entrypoints } of entrypointBundles) {
    if (!options.format) throw createError('Missing output format.');

    for (const entrypoint of entrypoints) {
      append(body, createLoadScript(entrypoint.importPath, options.format));
    }
  }

  return serialize(documentAst);
}

module.exports = {
  injectBundles,
  // export for testing
  createLoadScript,
};
