/** @typedef {import('@babel/core').PluginObj} PluginObj */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath<T> */

/**
 * @typedef {object} BaseClass
 * @property {string} name
 * @property {string} [import]
 */

/**
 * @typedef {object} Decorator
 * @property {string} name
 * @property {string} [import]
 */

/**
 * @typedef {object} FunctionOption
 * @property {string} name
 * @property {string} [import]
 */

/**
 * @typedef {object} BabelPluginWcHmrOptions
 * @property {string} rootDir
 * @property {BaseClass[]} [baseClasses]
 * @property {Decorator[]} [decorators]
 * @property {FunctionOption[]} [functions]
 * @property {string[]} [patches]
 */

const { types } = require('@babel/core');
const path = require('path');

const { findDefinedCustomElement } = require('./customElementsDefine');
const { findDecoratedCustomElement } = require('./decorators');
const { injectRegisterClass, injectRuntime } = require('./inject');
const { parseOptions, singlePath, addToSet } = require('./utils');
const { findFunctionComponent } = require('./functions');
const { getImportedVariableNames } = require('./getImportedVariableNames');
const { implementsBaseClass } = require('./class');
const { createError } = require('../utils');

/** @returns {PluginObj} */
function babelPluginWcHmr() {
  return {
    visitor: {
      Program(program) {
        if (!this.filename) throw createError('Missing filename');
        const resolvedFilename = path.resolve(this.filename);
        const opts = parseOptions(/** @type {BabelPluginWcHmrOptions} */ (this.opts));
        const baseClasses = opts.baseClasses || [];
        const decorators = opts.decorators || [];
        const functions = opts.functions || [];

        /** @type {Set<string>} */
        const baseClassNames = new Set();
        /** @type {Set<string>} */
        const decoratorNames = new Set();
        /** @type {Set<string>} */
        const functionNames = new Set();
        /** @type {Set<string>} */
        const injectedClassNames = new Set();
        let injectedRegister = false;

        /**
         * @param {NodePath<any>} nodePath
         * @param {string} name
         * @param {boolean} insertAfter
         */
        function maybeInjectRegister(nodePath, name, insertAfter = false) {
          if (injectedClassNames.has(name)) {
            return;
          }
          injectRegisterClass(nodePath, name, insertAfter);
          injectedRegister = true;
          injectedClassNames.add(name);
        }

        // add decorators that don't require their import to be checked
        addToSet(
          baseClassNames,
          baseClasses.filter(b => !b.import).map(b => b.name),
        );
        addToSet(
          decoratorNames,
          decorators.filter(c => !c.import).map(d => d.name),
        );
        addToSet(
          functionNames,
          functions.filter(c => !c.import).map(d => d.name),
        );

        program.traverse({
          ImportDeclaration(importDecl) {
            // find all base classes and decorators that match this import
            const result = getImportedVariableNames(
              baseClasses,
              decorators,
              functions,
              importDecl,
              resolvedFilename,
              opts.rootDir,
            );
            addToSet(baseClassNames, result.baseClassNames);
            addToSet(decoratorNames, result.decoratorNames);
            addToSet(functionNames, result.functionNames);
          },
        });

        program.traverse({
          VariableDeclaration(varDecl) {
            const name = findFunctionComponent(varDecl, functionNames);
            if (name) {
              maybeInjectRegister(varDecl, name);
            }
          },

          CallExpression(callExpr) {
            const callee = callExpr.get('callee');
            const args = callExpr.get('arguments');
            if (!singlePath(callee) || !Array.isArray(args)) {
              return;
            }

            if (callee.isMemberExpression()) {
              // this might be a customElements.define call
              const definedCustomElement = findDefinedCustomElement(callee, args);
              if (!definedCustomElement) {
                return;
              }

              if (definedCustomElement.isIdentifier()) {
                maybeInjectRegister(callExpr, definedCustomElement.node.name);
              }

              if (
                definedCustomElement.isClassExpression() ||
                definedCustomElement.isCallExpression()
              ) {
                // take inline class expression out of the define so that it can be registered
                const id = callExpr.scope.generateUidIdentifierBasedOnNode(
                  definedCustomElement.node,
                );
                const { name } = id;

                if (!injectedClassNames.has(name)) {
                  callExpr.insertBefore(
                    types.variableDeclaration('const', [
                      types.variableDeclarator(id, definedCustomElement.node),
                    ]),
                  );
                  definedCustomElement.replaceWith(id);
                  maybeInjectRegister(callExpr, name);
                }
              }
              return;
            }

            if (decoratorNames.size > 0) {
              if (callee.isIdentifier()) {
                // this might be a decorated class
                const decoratedCustomElement = findDecoratedCustomElement(
                  decoratorNames,
                  callee,
                  args,
                );
                if (!decoratedCustomElement) {
                  return;
                }

                if (decoratedCustomElement.isIdentifier()) {
                  let assignExpr = callExpr.parentPath;
                  while (assignExpr && assignExpr.isAssignmentExpression()) {
                    assignExpr = assignExpr.parentPath;
                  }
                  maybeInjectRegister(assignExpr, decoratedCustomElement.node.name);
                }
              }
            }
          },

          ClassDeclaration(classDecl) {
            // this is a class declaration like class A extends HTMLElement {}
            if (implementsBaseClass(classDecl, baseClassNames)) {
              maybeInjectRegister(classDecl, classDecl.node.id.name, true);
            }
          },

          ClassExpression(classExpr) {
            const { parent, parentPath: varDeclarator } = classExpr;
            if (!parent || varDeclarator.isVariableDeclarator()) {
              return;
            }
            if (!varDeclarator || varDeclarator.parentPath.isVariableDeclaration()) {
              return;
            }
            const id = varDeclarator.get('id');
            if (!singlePath(id) || !id.isIdentifier()) {
              return;
            }

            const injectScope = varDeclarator.parentPath;
            if (!injectScope) {
              return;
            }

            // this is a class expression assignment like const A = class B extends HTMLElement {}
            if (implementsBaseClass(classExpr, baseClassNames)) {
              maybeInjectRegister(classExpr, id.node.name, true);
            }
          },
        });

        if (injectedRegister) {
          injectRuntime(opts, program);
        }
      },
    },
  };
}

module.exports = babelPluginWcHmr;
