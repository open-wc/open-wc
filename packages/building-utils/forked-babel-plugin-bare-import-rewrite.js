// @ts-nocheck
/* eslint-disable */
'use strict';

/**
 * Fork of babel-plugin-bare-import-rewrite:
 * - Adds `preserveSymlinks` when calling `resolve`
 * - Disabled rewrite of module folder
 *
 * We can look into making a PR to merge these things back upstream,
 * but some are fundamental design choices.
 */

const path = require('path');

const syntax = require('@babel/plugin-syntax-dynamic-import');
const whatwgUrl = require('whatwg-url');
const resolve = require('resolve');
const pathIsInside = require('path-is-inside');
const minimatch = require('minimatch');
const arrify = require('arrify');

const isPathSpecifier = str => /^\.{0,2}[/\\]/.test(str);
const pathToURL = str => {
  /* istanbul ignore next */
  if (path.sep === path.win32.sep) {
    str = str.replace(/\\/g, '/');
  }

  return str;
};

function basedirResolve(importPath, sourceFileName, pluginOptions) {
  const { alwaysRootImport, neverRootImport } = {
    alwaysRootImport: [],
    neverRootImport: [],
    ...pluginOptions,
  };
  const sourceDirName = path.dirname(sourceFileName);

  if (isPathSpecifier(importPath)) {
    /* Not a bare import. */
    return sourceDirName;
  }

  if (!Array.isArray(alwaysRootImport) || alwaysRootImport.length === 0) {
    return sourceDirName;
  }

  const importPackage = importPath.split('/', importPath[0] === '@' ? 2 : 1).join('/');

  if (
    alwaysRootImport.some(v => minimatch(importPackage, v)) &&
    !neverRootImport.some(v => minimatch(importPackage, v))
  ) {
    return pluginOptions.rootBaseDir || process.cwd();
  }

  return sourceDirName;
}

function absResolve(importPath, sourceFileName, pluginOptions = {}) {
  if (whatwgUrl.parseURL(importPath) !== null) {
    return importPath;
  }

  const result = resolve.sync(importPath, {
    basedir: basedirResolve(importPath, sourceFileName, pluginOptions),
    extensions: pluginOptions.extensions || ['.mjs', '.js', 'json'],
    moduleDirectory: pluginOptions.resolveDirectories || 'node_modules',
    preserveSymlinks: false,
    packageFilter(packageJson) {
      packageJson.main = packageJson.module || packageJson['jsnext:main'] || packageJson.main;
      return packageJson;
    },
  });

  // use node's resolve to convert symlinks to real paths
  return require.resolve(result);
}

function tryResolve(babelPath, importPath, sourceFileName, pluginOptions) {
  if (whatwgUrl.parseURL(importPath) !== null) {
    return importPath;
  }

  if (arrify(pluginOptions.ignorePrefixes).some(ignore => importPath.startsWith(ignore))) {
    return importPath;
  }

  try {
    const importPathAbs = absResolve(importPath, sourceFileName, pluginOptions);
    const nodeModules = path.resolve(pluginOptions.rootBaseDir || process.cwd(), 'node_modules');
    const isNodeModule = pathIsInside(importPathAbs, nodeModules);
    const fromNodeModule = pathIsInside(path.resolve(sourceFileName), nodeModules);
    let importPathRel = path.relative(path.dirname(sourceFileName), importPathAbs);
    const sep = pluginOptions.fsPath === true ? path.sep : path.posix.sep;

    // Disabled in fork
    // if (isNodeModule && !fromNodeModule) {
    // 	const modulesDir = pluginOptions.modulesDir || '/node_modules';
    // 	if (modulesDir.includes('://')) {
    // 		return modulesDir + (modulesDir.endsWith('/') ? '' : '/') + pathToURL(path.relative(nodeModules, importPathAbs));
    // 	}

    // 	importPathRel = path.join(
    // 		pluginOptions.modulesDir || '/node_modules',
    // 		path.relative(nodeModules, importPathAbs));
    // }

    if (pluginOptions.fsPath !== true) {
      importPathRel = pathToURL(importPathRel);
    }

    if (!isPathSpecifier(importPathRel) && !path.isAbsolute(importPathRel)) {
      importPathRel = '.' + sep + importPathRel;
    }

    return importPathRel;
  } catch (error) {
    if (pluginOptions.failOnUnresolved) {
      throw babelPath.buildCodeFrameError(`Could not resolve '${importPath}'.`);
    } else {
      console.error(`Could not resolve '${importPath}' in file '${sourceFileName}'.`);
      return importPath;
    }
  }
}

module.exports = ({ types: t }) => ({
  inherits: syntax.default,
  visitor: {
    CallExpression(path, { file, opts }) {
      if (path.node.callee.type !== 'Import') {
        return;
      }

      const [source] = path.get('arguments');
      if (source.type !== 'StringLiteral') {
        /* Should never happen */
        return;
      }

      source.replaceWith(
        t.stringLiteral(
          tryResolve(path, source.node.value, file.opts.parserOpts.sourceFileName, opts),
        ),
      );
    },
    'ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration'(path, { file, opts }) {
      const source = path.get('source');

      // An export without a 'from' clause
      if (source.node === null) {
        return;
      }

      source.replaceWith(
        t.stringLiteral(
          tryResolve(path, source.node.value, file.opts.parserOpts.sourceFileName, opts),
        ),
      );
    },
  },
});
module.exports.resolve = absResolve;
