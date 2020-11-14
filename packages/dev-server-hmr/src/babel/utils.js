/** @typedef {import('./babelPluginWcHmr').BabelPluginWcHmrOptions} BabelPluginWcHmrOptions */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath<T> */

const { createError } = require('../utils');

/**
 * @param {BabelPluginWcHmrOptions} options
 * @returns {BabelPluginWcHmrOptions}
 */
function parseOptions(options) {
  if (!options) throw createError('Missing babel plugin options');
  if (!options.rootDir) throw createError('Missing rootDir in babel plugin options');
  return options;
}

/**
 * @template T
 * @param {NodePath<T>} nodePath
 */
function resolvePath(nodePath) {
  const pathCast = /** @type {any} */ (nodePath);
  return /** @type {NodePath<unknown>} */ (pathCast.resolve());
}

/**
 * @template T
 * @param {NodePath<T> | NodePath<T>[]} nodePath
 * @returns {nodePath is NodePath<T>}
 */
function singlePath(nodePath) {
  return nodePath && !Array.isArray(nodePath);
}

/**
 * @template T
 * @param {Set<T>} set
 * @param {T[]} elements
 */
function addToSet(set, elements) {
  for (const e of elements) {
    set.add(e);
  }
}

module.exports = { parseOptions, resolvePath, singlePath, addToSet };
