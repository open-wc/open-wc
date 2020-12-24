/** @typedef {import('@babel/types').Program} Program */
/** @typedef {import('@babel/types').ClassDeclaration} ClassDeclaration */
/** @typedef {import('@babel/types').Expression} Expression */
/** @typedef {import('@babel/types').ExpressionStatement} ExpressionStatement */
/** @typedef {import('./babelPluginWcHmr').BabelPluginWcHmrOptions} BabelPluginWcHmrOptions */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath<T> */

const { parse, types: t } = require('@babel/core');
const { WC_HMR_NAMESPACE, WC_HMR_MODULE_PATCH, WC_HMR_MODULE_RUNTIME } = require('../constants');
const { singlePath, parseStatement } = require('./utils');

const REGISTER_FN_NAME = 'register';

/**
 * @param {NodePath<any>} callExpr
 */
function isRegisterCall(callExpr) {
  if (!singlePath(callExpr) || !callExpr.isCallExpression()) return;

  const callee = callExpr.get('callee');
  if (!singlePath(callee) || !callee.isMemberExpression()) return;

  const obj = callee.get('object');
  const prop = callee.get('property');
  if (!singlePath(obj) || !singlePath(prop)) return;

  return (
    obj.isIdentifier() &&
    obj.node.name === WC_HMR_NAMESPACE &&
    prop.isIdentifier() &&
    prop.node.name === REGISTER_FN_NAME
  );
}

/**
 * @param {NodePath<ClassDeclaration> | NodePath<Expression>} clazz
 */
function isClassRegistered(clazz) {
  const callExpr = clazz.parentPath;
  return isRegisterCall(clazz) || isRegisterCall(callExpr);
}

/**
 * @param {NodePath<ClassDeclaration> | NodePath<Expression> } clazz
 */
function findComponentName(clazz) {
  if (clazz.isClassDeclaration()) {
    // class declaration always has a name
    return clazz.node.id.name;
  }

  if (clazz.isClassExpression()) {
    if (clazz.node.id && clazz.node.id.name) {
      // class expression can have a name
      return clazz.node.id.name;
    }
  }

  const parent = clazz.parentPath;
  if (parent.isVariableDeclarator()) {
    const id = parent.get('id');
    if (singlePath(id) && id.isIdentifier()) {
      // there is an ID that defines the name of the class
      return id.node.name;
    }
  }
}

/**
 * Wraps a class declaration or expression into a register call
 * @param {NodePath<ClassDeclaration> | NodePath<Expression> } clazz
 * @param {string} componentName
 */
function injectRegisterClass(clazz, componentName) {
  const callee = t.memberExpression(t.identifier(WC_HMR_NAMESPACE), t.identifier(REGISTER_FN_NAME));
  const importMeta = parseStatement(`import.meta`, t.isExpressionStatement).expression;
  const componentNameString = t.stringLiteral(componentName);

  const classExpr = clazz.isExpression()
    ? clazz.node
    : t.classExpression(
        clazz.node.id,
        clazz.node.superClass,
        clazz.node.body,
        clazz.node.decorators,
      );
  const callExpr = t.callExpression(callee, [importMeta, componentNameString, classExpr]);

  if (clazz.isExpression()) {
    clazz.replaceWith(callExpr);
  } else if (clazz.isClassDeclaration()) {
    const { name } = clazz.node.id;
    const declarator = t.variableDeclarator(t.identifier(name), callExpr);
    const declaration = t.variableDeclaration('let', [declarator]);
    clazz.replaceWith(declaration);
  }
}

/**
 * @param {BabelPluginWcHmrOptions} options
 * @param {NodePath<Program>} program
 */
function injectRuntime(options, program) {
  const patch =
    options.patches && options.patches.length > 0 ? `import '${WC_HMR_MODULE_PATCH}'; ` : '';
  const toInject = parse(
    `${patch}import * as ${WC_HMR_NAMESPACE} from '${WC_HMR_MODULE_RUNTIME}'; if(import.meta.hot) { import.meta.hot.accept(); }`,
  );

  if (toInject) {
    program.node.body.unshift(/** @type {any} */ (toInject));
  }
}

module.exports = { findComponentName, injectRegisterClass, isClassRegistered, injectRuntime };
