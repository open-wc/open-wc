/* eslint-disable no-await-in-loop, no-restricted-syntax, no-console, max-classes-per-file */
import whatwgUrl from 'whatwg-url';
import pathIsInside from 'path-is-inside';
import deepmerge from 'deepmerge';
//@ts-ignore
import { parse } from 'es-module-lexer';
import createRollupResolve, { Options as NodeResolveOptions } from '@rollup/plugin-node-resolve';
import path from 'path';
import { toBrowserPath } from './utils';
import { createBabelTransform, defaultConfig } from './babel-transform';
const nodeResolvePackageJson = require('@rollup/plugin-node-resolve/package.json');

interface ResolveConfig {
  rootDir: string;
  fileExtensions: string[];
  nodeResolve: (importee: string, importer: string) => Promise<string>;
}

interface ParsedImport {
  s: number;
  e: number;
  ss: number;
  se: number;
  d: number;
}

export type ResolveModuleImports = (importer: string, source: string) => Promise<string>;

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
export class ModuleNotFoundError extends Error {}

/**
 * Resolves an import which is a concatenated string (for ex. import('my-package/files/${filename}'))
 *
 * Resolving is done by taking the package name and resolving that, then prefixing the resolves package
 * to the import. This requires the full package name to be present in the string.
 */
async function resolveConcatenatedImport(
  importer: string,
  importee: string,
  cfg: ResolveConfig,
): Promise<string> {
  let pathToResolve = importee;
  let pathToAppend = '';

  const parts = importee.split('/');
  if (importee.startsWith('@')) {
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

  const resolvedPackage = await cfg.nodeResolve(`${pathToResolve}/package.json`, importer);

  const packageDir = resolvedPackage.substring(0, resolvedPackage.length - 'package.json'.length);
  return `${packageDir}${pathToAppend}`;
}

async function createSyntaxError(sourceFilename: string, source: string, originalError: Error) {
  // if es-module-lexer cannot parse the file, use babel to generate a user-friendly error message
  await babelTransform(sourceFilename, source);
  // if babel did not have any error, throw a syntax error and log the original error
  console.error(originalError);
  return new ResolveSyntaxError();
}

async function maybeResolveImport(
  importer: string,
  importee: string,
  concatenatedString: boolean,
  cfg: ResolveConfig,
) {
  // don't touch url imports
  if (whatwgUrl.parseURL(importee) !== null) {
    return importee;
  }

  const relativeImport = importee.startsWith('.') || importee.startsWith('/');
  const jsFileImport = cfg.fileExtensions.includes(path.extname(importee));

  // for performance, don't resolve relative imports of js files. we only do this for js files,
  // because an import like ./foo/bar.css might actually need to resolve to ./foo/bar.css.js
  if (relativeImport && jsFileImport) {
    return importee;
  }

  const sourceFileDir = path.dirname(importer);

  try {
    let resolvedImportFilePath;

    if (concatenatedString) {
      // if this dynamic import is a concatenated string, try our best to resolve. Otherwise leave it untouched and resolve it at runtime.
      try {
        resolvedImportFilePath = await resolveConcatenatedImport(importer, importee, cfg);
      } catch (error) {
        return importee;
      }
    } else {
      resolvedImportFilePath = await cfg.nodeResolve(importee, importer);
    }

    if (!pathIsInside(resolvedImportFilePath, cfg.rootDir)) {
      throw new Error(
        `Import "${importee}" resolved to the file "${resolvedImportFilePath}" which is outside the web server root, and cannot be served ` +
          'by es-dev-server. Install the module locally in the current project, or expand the root directory. ' +
          'If this is a symlink or if you used npm link, you can run es-dev-server with the --preserve-symlinks option',
      );
    }

    const relativeImportFilePath = path.relative(sourceFileDir, resolvedImportFilePath);
    const resolvedimportee = toBrowserPath(relativeImportFilePath);
    return resolvedimportee.startsWith('.') ? resolvedimportee : `./${resolvedimportee}`;
  } catch (error) {
    // make module not found error message shorter
    if (error instanceof ModuleNotFoundError) {
      const relativeImportFilePath = path.relative(cfg.rootDir, importer);
      const resolvedimportee = toBrowserPath(relativeImportFilePath);
      const relativePathToErrorFile = resolvedimportee.startsWith('.')
        ? resolvedimportee
        : `./${resolvedimportee}`;
      throw new Error(`Could not resolve import "${importee}" in "${relativePathToErrorFile}".`);
    }
    throw error;
  }
}

function getImportee(importee: string) {
  const [withoutParams, params] = importee.split('?');
  const [withoutHash, hash] = withoutParams.split('#');
  return [withoutHash, `${params ? `?${params}` : ''}${hash ? `#${hash}` : ''}`];
}

async function resolveModuleImportsWithConfig(
  importer: string,
  source: string,
  cfg: ResolveConfig,
) {
  let imports: ParsedImport[];
  try {
    [imports] = await parse(source, importer);
  } catch (error) {
    throw await createSyntaxError(importer, source, error);
  }

  let resolvedSource = '';
  let lastIndex = 0;

  for (const imp of imports) {
    const { s: start, e: end, d: dynamicImportIndex } = imp;

    if (dynamicImportIndex === -1) {
      // static import
      const [importee, importeeSuffix] = getImportee(source.substring(start, end));
      const resolvedimportee = await maybeResolveImport(importer, importee, false, cfg);

      resolvedSource += `${source.substring(lastIndex, start)}${resolvedimportee}${importeeSuffix}`;
      lastIndex = end;
    } else if (dynamicImportIndex >= 0) {
      // dynamic import
      const dynamicStart = start + 1;
      const dynamicEnd = end - 1;

      const [importee, importeeSuffix] = getImportee(source.substring(dynamicStart, dynamicEnd));
      const stringSymbol = source[dynamicStart - 1];
      const isStringLiteral = [`\``, "'", '"'].includes(stringSymbol);
      const concatenatedString =
        stringSymbol === `\`` || importee.includes("'") || importee.includes('"');
      const resolvedimportee = isStringLiteral
        ? await maybeResolveImport(importer, importee, concatenatedString, cfg)
        : importee;

      resolvedSource += `${source.substring(
        lastIndex,
        dynamicStart,
      )}${resolvedimportee}${importeeSuffix}`;
      lastIndex = dynamicEnd;
    }
  }

  if (lastIndex < source.length - 1) {
    resolvedSource += `${source.substring(lastIndex, source.length)}`;
  }

  return resolvedSource;
}

const fakePluginContext = {
  meta: {
    rollupVersion: nodeResolvePackageJson.peerDependencies.rollup,
  },
  warn(...msg: string[]) {
    console.warn('[es-dev-server] node-resolve: ', ...msg);
  },
};

export function createResolveModuleImports(
  rootDir: string,
  fileExtensions: string[],
  opts: NodeResolveOptions = {},
): ResolveModuleImports {
  const rollupResolve = createRollupResolve({
    rootDir,
    // allow resolving polyfills for nodejs libs
    preferBuiltins: false,
    extensions: fileExtensions,
    ...opts,
  });

  const preserveSymlinks =
    (opts && opts.customResolveOptions && opts.customResolveOptions.preserveSymlinks) || false;
  (rollupResolve as any).buildStart.call(fakePluginContext as any, { preserveSymlinks });

  async function nodeResolve(importee: string, importer: string) {
    const result = await (rollupResolve as any).resolveId.call(
      fakePluginContext as any,
      importee,
      importer,
    );
    if (!result || !result.id) {
      throw new ModuleNotFoundError();
    }
    return result.id;
  }

  return (importer, source) =>
    resolveModuleImportsWithConfig(importer, source, {
      rootDir,
      fileExtensions,
      nodeResolve,
    });
}
