/** @typedef {import('@babel/types').ImportDefaultSpecifier} ImportDefaultSpecifier */
/** @typedef {import('@babel/types').ImportNamespaceSpecifier} ImportNamespaceSpecifier */
/** @typedef {import('@babel/types').ImportSpecifier} ImportSpecifier */
/** @typedef {import('@babel/types').ImportDeclaration} ImportDeclaration */
/** @typedef {import('@babel/types').StringLiteral} StringLiteral */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath */
/** @typedef {import('./babelPluginWcHmr').BaseClass} BaseClass */
/** @typedef {import('./babelPluginWcHmr').Decorator} Decorator */

const path = require('path');
const { singlePath } = require('./utils');

/**
 * @param {string} importSpecifier
 * @param {string} importPath
 * @param {string} filename
 * @param {string} rootDir
 * @returns {boolean}
 */
function isMatchingImport(importSpecifier, importPath, filename, rootDir) {
  // is this a non-bare import
  if (
    importSpecifier.startsWith('../') ||
    importSpecifier.startsWith('./') ||
    importSpecifier.startsWith('/')
  ) {
    const partialImportFilePath = importSpecifier.split('/').join(path.sep);
    const joinBase = importSpecifier.startsWith('/') ? rootDir : path.dirname(filename);
    const importFilePath = path.join(joinBase, partialImportFilePath);

    return importFilePath === importPath || `${importFilePath}.js` === importPath;
  }

  // this is a bare import
  return importPath === importSpecifier || `${importPath}.js` === importSpecifier;
}

/**
 * @param {BaseClass[]} baseClasses
 * @param {Decorator[]} decorators
 * @param {string} importSpecifier
 * @param {string} filename
 * @param {string} rootDir
 */
function getMatchesForImport(baseClasses, decorators, importSpecifier, filename, rootDir) {
  return {
    baseClasses: baseClasses.filter(
      baseClass =>
        baseClass.import && isMatchingImport(importSpecifier, baseClass.import, filename, rootDir),
    ),
    decorators: decorators.filter(
      decorator =>
        decorator.import && isMatchingImport(importSpecifier, decorator.import, filename, rootDir),
    ),
  };
}

/**
 * @param {BaseClass[]} baseClasses
 * @param {Decorator[]} decorators
 * @param {NodePath<ImportDeclaration>} importDeclaration
 * @param {string} filename
 * @param {string} rootDir
 */
function getImportedVariableNames(baseClasses, decorators, importDeclaration, filename, rootDir) {
  const importSpecifier = importDeclaration.node.source.value;
  const matches = getMatchesForImport(baseClasses, decorators, importSpecifier, filename, rootDir);
  /** @type {string[]} */
  const baseClassNames = [];
  const decoratorNames = [];

  if (matches.baseClasses.length || matches.decorators.length) {
    for (const specifier of importDeclaration.get('specifiers')) {
      if (specifier.isImportDefaultSpecifier()) {
        if (matches.baseClasses.some(cl => cl.name === 'default')) {
          baseClassNames.push(specifier.node.local.name);
        }
        if (matches.decorators.some(cl => cl.name === 'default')) {
          decoratorNames.push(specifier.node.local.name);
        }
      } else if (specifier.isImportSpecifier()) {
        const imported = specifier.get('imported');
        if (singlePath(imported)) {
          const importedName = imported.isIdentifier()
            ? imported.node.name
            : /** @type {StringLiteral} */ (imported.node).value;
          if (matches.baseClasses.some(cl => cl.name === importedName)) {
            baseClassNames.push(specifier.node.local.name);
          }
          if (matches.decorators.some(cl => cl.name === importedName)) {
            decoratorNames.push(specifier.node.local.name);
          }
        }
      }
    }
  }
  return { baseClassNames, decoratorNames };
}

module.exports = { getImportedVariableNames };
