/* eslint-disable no-await-in-loop, no-restricted-syntax */
import whatwgUrl from 'whatwg-url';
import nodeResolve from 'resolve';
import pathIsInside from 'path-is-inside';
import path from 'path';
import { analyzeModuleSyntax } from './es-module-lexer.js';
import { toBrowserPath } from './utils.js';

export class ResolveSyntaxError extends Error {}

/**
 * @param {string} importPath
 * @param {import('resolve').AsyncOpts} options
 * @returns {Promise<string>}
 */
function nodeResolveAsync(importPath, options) {
  return new Promise((resolve, reject) =>
    nodeResolve(importPath, options, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }),
  );
}

/**
 * @typedef {object} ResolveConfig
 * @property {string[]} fileExtensions
 * @property {string[]} moduleDirectories
 * @property {boolean} preserveSymlinks
 */

/**
 * @param {string} rootDir
 * @param {string} sourceFilePath
 * @param {string} importPath
 * @param {ResolveConfig} config
 */
async function resolveImport(rootDir, sourceFilePath, importPath, config) {
  // don't touch url imports
  if (whatwgUrl.parseURL(importPath) !== null) {
    return importPath;
  }

  // don't touch relative of absolute imports with a file extension
  if (
    (importPath.startsWith('./') || importPath.startsWith('/')) &&
    path.extname(importPath) !== ''
  ) {
    return importPath;
  }

  const sourceFileDir = path.dirname(sourceFilePath);

  try {
    const resolvedImportFilePath = await nodeResolveAsync(importPath, {
      basedir: sourceFileDir,
      extensions: config.fileExtensions,
      moduleDirectory: config.moduleDirectories,
      preserveSymlinks: config.preserveSymlinks,
      packageFilter(packageJson) {
        /* eslint-disable no-param-reassign */
        packageJson.main = packageJson.module || packageJson['jsnext:main'] || packageJson.main;
        return packageJson;
      },
    });

    if (!pathIsInside(resolvedImportFilePath, rootDir)) {
      throw new Error(
        `Import "${importPath}" resolved to the file "${resolvedImportFilePath}" which is outside the root directory. ` +
          'Install the module locally in the current project, or expand the root directory. If this is a symlink or if you used npm link, ' +
          ' you can use the preserveSymlinks option',
      );
    }

    const relativeImportFilePath = path.relative(sourceFileDir, resolvedImportFilePath);
    const resolvedImportPath = toBrowserPath(relativeImportFilePath);
    return resolvedImportPath.startsWith('.') ? resolvedImportPath : `./${resolvedImportPath}`;
  } catch (error) {
    // make module not found error message shorter
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(`Could not find module "${importPath}".`);
    }
    throw error;
  }
}

/**
 * @param {string} rootDir
 * @param {string} sourceFilePath
 * @param {string} source
 * @param {ResolveConfig} config
 */
export async function resolveModuleImports(rootDir, sourceFilePath, source, config) {
  const [imports /* exports */, , error] = analyzeModuleSyntax(source);

  if (error) {
    throw new ResolveSyntaxError(`Syntax error.`);
  }

  let resolvedSource = '';
  let lastIndex = 0;

  for (const imp of imports) {
    const { s: start, e: end, d: dynamicImportIndex } = imp;

    if (dynamicImportIndex === -1) {
      // static import
      const importPath = source.substring(start, end);
      const resolvedImportPath = await resolveImport(rootDir, sourceFilePath, importPath, config);

      resolvedSource += `${source.substring(lastIndex, start)}${resolvedImportPath}`;
      lastIndex = end;
    } else if (dynamicImportIndex >= 0) {
      // dynamic import
      const dynamicStart = end + 1;
      const dynamicEnd = dynamicImportIndex - 1;

      const importPath = source.substring(dynamicStart, dynamicEnd);
      const resolvedImportPath = await resolveImport(rootDir, sourceFilePath, importPath, config);

      resolvedSource += `${source.substring(lastIndex, dynamicStart)}${resolvedImportPath}`;
      lastIndex = dynamicEnd;
    }
  }

  if (lastIndex < source.length - 1) {
    resolvedSource += `${source.substring(lastIndex, source.length)}`;
  }

  return resolvedSource;
}
