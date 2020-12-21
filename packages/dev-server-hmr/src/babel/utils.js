/** @typedef {import('./babelPluginWcHmr').BabelPluginWcHmrOptions} BabelPluginWcHmrOptions */
/** @typedef {import('@babel/types').CallExpression} CallExpression */
/** @typedef {import('@babel/types').ClassDeclaration} ClassDeclaration */
/** @typedef {import('@babel/types').Expression} Expression */
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
 * @param {NodePath<any>} nodePath
 */
function findReferencedPath(nodePath) {
  let toResolve = nodePath;
  if (nodePath.isReferencedIdentifier()) {
    const binding = nodePath.scope.getBinding(nodePath.node.name);
    if (binding) {
      toResolve = binding.path;
    }
  }
  return resolvePath(toResolve);
}

/**
 * @param {NodePath<any>} nodePath
 * @returns {NodePath<ClassDeclaration> | NodePath<Expression> | undefined}
 */
function findComponentDefinition(nodePath) {
  if (!nodePath) return;

  if (nodePath.isIdentifier()) {
    const reference = findReferencedPath(nodePath);
    if (reference.isClassDeclaration() || reference.isExpression()) {
      return reference;
    }

    return undefined;
  }

  if (nodePath.isExpression()) {
    return nodePath;
  }
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

module.exports = { parseOptions, resolvePath, findComponentDefinition, singlePath, addToSet };
