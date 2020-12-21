/** @typedef {import('@babel/core').PluginObj} PluginObj */
/** @typedef {import('@babel/types').ClassDeclaration} ClassDeclaration */
/** @typedef {import('@babel/types').Expression} Expression */
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

const path = require('path');

const { findDefinedCustomElement } = require('./customElementsDefine');
const { findDecoratedCustomElement } = require('./decorators');
const { injectRegisterClass, injectRuntime } = require('./inject');
const { parseOptions, singlePath, addToSet } = require('./utils');
const { isFunctionComponent } = require('./functions');
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
        let injectedRegister = false;

        baseClassNames.add('HTMLElement');

        /**
         * @param {NodePath<ClassDeclaration> | NodePath<Expression>} nodePath
         */
        function injectRegister(nodePath) {
          injectRegisterClass(nodePath);
          injectedRegister = true;
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
          CallExpression(callExpr) {
            if (callExpr.isCallExpression() && isFunctionComponent(callExpr, functionNames)) {
              injectRegister(/** @type {NodePath<Expression>} */ (callExpr));
              return;
            }

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

              injectRegister(definedCustomElement);
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

                injectRegister(decoratedCustomElement);
              }
            }
          },

          ClassDeclaration(classDecl) {
            // this is a class declaration like class A extends HTMLElement {}
            if (implementsBaseClass(classDecl, baseClassNames)) {
              injectRegister(classDecl);
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
            if (classExpr.isExpression() && implementsBaseClass(classExpr, baseClassNames)) {
              injectRegister(classExpr);
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
