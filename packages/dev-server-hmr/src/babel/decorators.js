/** @typedef {import('@babel/types').Identifier} Identifier */
/** @typedef {import('./babelPluginWcHmr').Decorator} Decorator */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath<T> */

const { singlePath } = require('./utils');

/**
 * @param {Set<string>} decoratorNames
 * @param {NodePath<Identifier>} callee
 * @param {NodePath<any>[]} args
 */
function findCompiledTsDecoratedCustomElement(decoratorNames, callee, args) {
  // is this a decorator helper function?
  if (callee.node.name !== '__decorate') {
    return;
  }

  const [arrayExpr, decoratedClass] = args;
  // are we decorating an identifier (of a class)
  if (!singlePath(decoratedClass) || !decoratedClass.isIdentifier()) {
    return;
  }
  // is the first parameter an array of decorator functions?
  if (!singlePath(arrayExpr) || !arrayExpr.isArrayExpression()) {
    return;
  }
  const elements = arrayExpr.get('elements');
  if (!Array.isArray(elements)) {
    return;
  }

  // find a decorator function called customElement
  const decoratorCall = elements.find(e => {
    if (!e.isCallExpression()) {
      return false;
    }
    const eCallee = e.get('callee');
    if (!singlePath(eCallee) || !eCallee.isIdentifier()) {
      return false;
    }
    return decoratorNames.has(eCallee.node.name);
  });

  if (!decoratorCall) {
    return;
  }
  return decoratedClass;
}

/**
 * @param {Set<string>} decoratorNames
 * @param {NodePath<Identifier>} callee
 * @param {NodePath<any>[]} args
 * @returns {NodePath<any> | undefined}
 */
function findDecoratedCustomElement(decoratorNames, callee, args) {
  // TODO: add non-compiled decorator when it becomes stage 3 and properly supported by babel
  return findCompiledTsDecoratedCustomElement(decoratorNames, callee, args);
}

module.exports = { findDecoratedCustomElement };
