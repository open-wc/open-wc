/** @typedef {import('@babel/types').ClassDeclaration} ClassDeclaration */
/** @typedef {import('@babel/types').ClassExpression} ClassExpression */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath<T> */

const { singlePath } = require('./utils');

/**
 * @param {NodePath<ClassDeclaration> | NodePath<ClassExpression>} classDeclOrExpr
 * @returns {NodePath<any> | undefined}
 */
function walkClassMixins(classDeclOrExpr) {
  let el = classDeclOrExpr.get('superClass');
  // walk possible mixin functions
  while (singlePath(el) && el.isCallExpression()) {
    const result = el.get('arguments');
    if (Array.isArray(result)) {
      [el] = result;
    }
  }

  return singlePath(el) ? el : undefined;
}

/**
 * @param {NodePath<ClassDeclaration> | NodePath<ClassExpression>} classDeclOrExpr
 * @param {Set<string>} baseClassNames
 */
function implementsBaseClass(classDeclOrExpr, baseClassNames) {
  const el = walkClassMixins(classDeclOrExpr);

  if (el && el.isIdentifier()) {
    const { name } = el.node;
    return baseClassNames.has(name);
  }
}

module.exports = { implementsBaseClass };
