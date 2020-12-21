/* eslint-disable no-console */
/** @typedef {import('@babel/types').MemberExpression} MemberExpression */
/** @typedef {import('@babel/types').CallExpression} CallExpression */
/** @typedef {import('@babel/types').ClassDeclaration} ClassDeclaration */
/** @typedef {import('@babel/types').Expression} Expression */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath<T> */

const { resolvePath, findComponentDefinition, singlePath } = require('./utils');

const GLOBALS = ['window', 'self', 'globalThis'];

/**
 * @param {NodePath<MemberExpression>} callee
 * @param {NodePath<unknown>[]} args
 */
function isDefineCall(callee, args) {
  const property = callee.get('property');

  if (!singlePath(property) || !property.isIdentifier() || property.node.name !== 'define') {
    return false;
  }

  if (!args || !Array.isArray(args)) {
    return false;
  }

  return (
    args.length >= 2 &&
    (args[1].isIdentifier() || args[1].isClassExpression() || args[1].isCallExpression())
  );
}

/** @param {NodePath<MemberExpression>} memberExpr */
function isCallOnCustomElementObject(memberExpr) {
  const object = memberExpr.get('object');
  if (!singlePath(object)) {
    return false;
  }

  if (object.isIdentifier()) {
    // we are dealing with <something>.define(), check if <something> references global customElements
    const resolvedIdPath = resolvePath(object);
    if (!resolvedIdPath || !resolvedIdPath.isIdentifier()) {
      return false;
    }
    return resolvedIdPath.node.name === 'customElements';
  }

  if (object.isMemberExpression()) {
    const property = object.get('property');
    if (
      !singlePath(property) ||
      !property.isIdentifier() ||
      property.node.name !== 'customElements'
    ) {
      return false;
    }
    // we are dealing with <something>.customElements.define, check if <something> is the global scope

    const subObject = object.get('object');
    if (!singlePath(subObject) || !subObject.isIdentifier()) {
      return false;
    }
    const resolvedIdPath = resolvePath(subObject);
    return (
      resolvedIdPath && resolvedIdPath.isIdentifier() && GLOBALS.includes(resolvedIdPath.node.name)
    );
  }

  return false;
}

/**
 * @param {NodePath<MemberExpression>} memberExpr
 * @param {NodePath<any>[]} args
 */
function findDefinedCustomElement(memberExpr, args) {
  if (isDefineCall(memberExpr, args) && isCallOnCustomElementObject(memberExpr)) {
    return findComponentDefinition(args[1]);
  }
}

module.exports = { findDefinedCustomElement };
