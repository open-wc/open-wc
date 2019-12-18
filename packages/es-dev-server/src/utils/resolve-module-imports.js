/* eslint-disable no-await-in-loop, no-restricted-syntax, no-console */
import whatwgUrl from 'whatwg-url';
import nodeResolveWithCallback from 'resolve';
import pathIsInside from 'path-is-inside';
import deepmerge from 'deepmerge';
// typescript can't resolve a .cjs file
// @ts-ignore
import { parse } from 'es-module-lexer';
import path from 'path';
import { toBrowserPath, logDebug } from './utils.js';
import { createBabelTransform, defaultConfig } from './babel-transform.js';

const CONCAT_NO_PACKAGE_ERROR =
  'Dynamic import with a concatenated string should start with a valid full package name.';

const babelTransform = createBabelTransform(
  // @ts-ignore
  deepmerge(defaultConfig, {
    babelrc: false,
    configFile: false,
  }),
);

export class ResolveSyntaxError extends Error {}

/**
 * @param {string} importPath
 * @param {import('resolve').AsyncOpts} options
 * @returns {Promise<string>}
 */
function nodeResolveAsync(importPath, options) {
  return new Promise((resolve, reject) =>
    nodeResolveWithCallback(importPath, options, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }),
  );
}

/**
 * @param {string} rootDir
 * @param {string} sourceFilePath
 * @param {string} importPath
 * @param {ResolveConfig} cfg
 * @returns {Promise<string>}
 */
async function nodeResolve(rootDir, sourceFilePath, importPath, cfg) {
  const relativeImport = importPath.startsWith('.') || importPath.startsWith('/');
  const sourceFileDir = path.dirname(sourceFilePath);
  const dedupe = !relativeImport && cfg.dedupeModules(importPath);
  if (dedupe) {
    logDebug(`Deduplicating import ${importPath} from ${sourceFilePath}`);
  }

  const options = {
    basedir: dedupe ? rootDir : sourceFileDir,
    extensions: cfg.fileExtensions,
    moduleDirectory: cfg.moduleDirectories,
    preserveSymlinks: cfg.preserveSymlinks,
    packageFilter(packageJson) {
      /* eslint-disable no-param-reassign */
      packageJson.main = packageJson.module || packageJson.main;
      return packageJson;
    },
  };
  try {
    return await nodeResolveAsync(importPath, options);
  } catch (error) {
    if (!dedupe) {
      throw error;
    }

    logDebug(
      `Could not dedupe import ${importPath} from ${sourceFilePath}, falling back to a relative resolve.`,
    );
    // if we are deduping and resolving from root did not work, resolve relative
    // original file instead
    return nodeResolveAsync(importPath, {
      ...options,
      basedir: sourceFileDir,
    });
  }
}

/**
 * Resolves an import which is a concatenated string (for ex. import('my-package/files/${filename}'))
 *
 * Resolving is done by taking the package name and resolving that, then prefixing the resolves package
 * to the import. This requires the full package name to be present in the string.
 *
 * @param {string} rootDir
 * @param {string} sourceFilePath
 * @param {string} importPath
 * @param {ResolveConfig} config
 * @returns {Promise<string>}
 */
async function resolveConcatenatedImport(rootDir, sourceFilePath, importPath, config) {
  let pathToResolve = importPath;
  let pathToAppend = '';

  const parts = importPath.split('/');
  if (importPath.startsWith('@')) {
    if (parts.length < 2) {
      throw new Error(CONCAT_NO_PACKAGE_ERROR);
    }

    pathToResolve = `${parts[0]}/${parts[1]}`;
    pathToAppend = parts.slice(2, parts.length).join('/');
  } else {
    if (parts.length < 1) {
      throw new Error(CONCAT_NO_PACKAGE_ERROR);
    }

    [pathToResolve] = parts;
    pathToAppend = parts.slice(1, parts.length).join('/');
  }

  const resolvedPackage = await nodeResolve(
    rootDir,
    sourceFilePath,
    `${pathToResolve}/package.json`,
    config,
  );

  const packageDir = resolvedPackage.substring(0, resolvedPackage.length - 'package.json'.length);
  return `${packageDir}${pathToAppend}`;
}

async function createSyntaxError(sourceFilename, source, originalError) {
  // if es-module-lexer cannot parse the file, use babel to generate a user-friendly error message
  await babelTransform(sourceFilename, source);
  // if babel did not have any error, throw a syntax error and log the original error
  console.error(originalError);
  throw new ResolveSyntaxError();
}

/**
 * @typedef {object} ResolveConfig
 * @property {string[]} fileExtensions
 * @property {string[]} moduleDirectories
 * @property {boolean} preserveSymlinks
 * @property {(path: string) => boolean} dedupeModules
 */

/**
 * @param {string} rootDir
 * @param {string} sourceFilePath
 * @param {string} importPath
 * @param {ResolveConfig} config
 * @param {boolean} [concatenated]
 */
async function resolveImport(rootDir, sourceFilePath, importPath, config, concatenated) {
  // don't touch url imports
  if (whatwgUrl.parseURL(importPath) !== null) {
    return importPath;
  }

  const relativeImport = importPath.startsWith('.') || importPath.startsWith('/');
  const jsFileImport = config.fileExtensions.includes(path.extname(importPath));

  // for performance, don't resolve relative imports of js files. we only do this for js files,
  // because an import like ./foo/bar.css might actually need to resolve to ./foo/bar.css.js
  if (relativeImport && jsFileImport) {
    return importPath;
  }

  const sourceFileDir = path.dirname(sourceFilePath);

  try {
    let resolvedImportFilePath;

    if (concatenated) {
      // if this dynamic import is a concatenated string, try our best to resolve. Otherwise leave it untouched and resolve it at runtime.
      try {
        resolvedImportFilePath = await resolveConcatenatedImport(
          rootDir,
          sourceFilePath,
          importPath,
          config,
        );
      } catch (error) {
        return importPath;
      }
    } else {
      resolvedImportFilePath = await nodeResolve(rootDir, sourceFilePath, importPath, config);
    }

    if (!pathIsInside(resolvedImportFilePath, rootDir)) {
      throw new Error(
        `Import "${importPath}" resolved to the file "${resolvedImportFilePath}" which is outside the web server root, and cannot be served ` +
          'by es-dev-server. Install the module locally in the current project, or expand the root directory. ' +
          'If this is a symlink or if you used npm link, you can run es-dev-server with the --preserve-symlinks option',
      );
    }

    const relativeImportFilePath = path.relative(sourceFileDir, resolvedImportFilePath);
    const resolvedImportPath = toBrowserPath(relativeImportFilePath);
    return resolvedImportPath.startsWith('.') ? resolvedImportPath : `./${resolvedImportPath}`;
  } catch (error) {
    // make module not found error message shorter
    if (error.code === 'MODULE_NOT_FOUND') {
      const relativeImportFilePath = path.relative(rootDir, sourceFilePath);
      const resolvedImportPath = toBrowserPath(relativeImportFilePath);
      const realtivePathToErrorFile = resolvedImportPath.startsWith('.')
        ? resolvedImportPath
        : `./${resolvedImportPath}`;
      throw new Error(`Could not resolve import "${importPath}" in "${realtivePathToErrorFile}".`);
    }
    throw error;
  }
}

function getImportPath(importPath) {
  const [withoutParams, params] = importPath.split('?');
  const [withoutHash, hash] = withoutParams.split('#');
  return [withoutHash, `${params ? `?${params}` : ''}${hash ? `#${hash}` : ''}`];
}

/**
 * @param {string} rootDir
 * @param {string} sourceFilePath
 * @param {string} source
 * @param {ResolveConfig} config
 */
export async function resolveModuleImports(rootDir, sourceFilePath, source, config) {
  let imports;
  try {
    [imports] = await parse(source, sourceFilePath);
  } catch (error) {
    await createSyntaxError(sourceFilePath, source, error);
  }

  let resolvedSource = '';
  let lastIndex = 0;

  for (const imp of imports) {
    const { s: start, e: end, d: dynamicImportIndex } = imp;

    if (dynamicImportIndex === -1) {
      // static import
      const [importPath, importPathSuffix] = getImportPath(source.substring(start, end));
      const resolvedImportPath = await resolveImport(rootDir, sourceFilePath, importPath, config);

      resolvedSource += `${source.substring(
        lastIndex,
        start,
      )}${resolvedImportPath}${importPathSuffix}`;
      lastIndex = end;
    } else if (dynamicImportIndex >= 0) {
      // dynamic import
      const dynamicStart = start + 1;
      const dynamicEnd = end - 1;

      const [importPath, importPathSuffix] = getImportPath(
        source.substring(dynamicStart, dynamicEnd),
      );
      const stringSymbol = source[dynamicStart - 1];
      const isStringLiteral = [`\``, "'", '"'].includes(stringSymbol);
      const dynamicString =
        stringSymbol === `\`` || importPath.includes("'") || importPath.includes('"');
      const resolvedImportPath = isStringLiteral
        ? await resolveImport(rootDir, sourceFilePath, importPath, config, dynamicString)
        : importPath;

      resolvedSource += `${source.substring(
        lastIndex,
        dynamicStart,
      )}${resolvedImportPath}${importPathSuffix}`;
      lastIndex = dynamicEnd;
    }
  }

  if (lastIndex < source.length - 1) {
    resolvedSource += `${source.substring(lastIndex, source.length)}`;
  }

  return resolvedSource;
}
