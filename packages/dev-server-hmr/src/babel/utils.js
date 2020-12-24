/** @typedef {import('./babelPluginWcHmr').BabelPluginWcHmrOptions} BabelPluginWcHmrOptions */
/** @typedef {import('@babel/types').CallExpression} CallExpression */
/** @typedef {import('@babel/types').ClassDeclaration} ClassDeclaration */
/** @typedef {import('@babel/types').Expression} Expression */
/** @typedef {import('@babel/types').Statement} Statement */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath<T> */

const { parse } = require('@babel/core');
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

/**
 * @template {Statement} T
 * @param {string} codeString
 * @param {(statement: Statement) => statement is T} assertion
 * @returns {T}
 */
function parseStatement(codeString, assertion) {
  const parsed = parse(codeString);
  if (!parsed || parsed.type !== 'File') {
    throw createError('Internal error: Expected File from parsed result.');
  }
  const statement = parsed.program.body[0];
  if (!statement || !assertion(statement)) {
    throw createError(`Internal error: Parsed result did not match assertion ${assertion.name}.`);
  }
  return statement;
}

module.exports = {
  parseOptions,
  resolvePath,
  findComponentDefinition,
  singlePath,
  addToSet,
  parseStatement,
};
