/** @typedef {import('@babel/types').VariableDeclaration} VariableDeclaration */
/** @typedef {import('@babel/types').Identifier} Identifier */
/** @typedef {import('./babelPluginWcHmr').Decorator} Decorator */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath<T> */

const { singlePath } = require('./utils');

/**
 * @param {NodePath<any>} decl
 * @param {Set<string>} functionNames
 * @returns {string | undefined}
 */
function getFunctionComponentName(decl, functionNames) {
  if (!decl.isVariableDeclarator()) {
    return;
  }

  const id = decl.get('id');
  const init = decl.get('init');
  if (!singlePath(id) || !id.isIdentifier() || !singlePath(init) || !init.isCallExpression()) {
    return;
  }

  const callee = init.get('callee');
  if (!singlePath(callee) || !callee.isIdentifier()) {
    return;
  }

  if (functionNames.has(callee.node.name)) {
    return id.node.name;
  }
}

/**
 * @param {NodePath<VariableDeclaration>} varDecl
 * @param {Set<string>} functionNames
 * @returns {string | undefined}
 */
function findFunctionComponent(varDecl, functionNames) {
  const declarations = varDecl.get('declarations');
  if (!Array.isArray(declarations)) {
    return;
  }

  for (const decl of declarations) {
    const name = getFunctionComponentName(decl, functionNames);
    if (name) {
      return name;
    }
  }
}

module.exports = { findFunctionComponent };
