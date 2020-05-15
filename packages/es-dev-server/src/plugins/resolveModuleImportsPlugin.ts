import deepmerge from 'deepmerge';
import { URL, pathToFileURL, fileURLToPath } from 'url';
import { Context } from 'koa';
//@ts-ignore
import { parse } from 'es-module-lexer';
import {
  getAttribute,
  getTextContent,
  remove,
  setTextContent,
} from '@open-wc/building-utils/dom5-fork';
import { findJsScripts } from '@open-wc/building-utils';
import {
  parse as parseHtml,
  serialize as serializeHtml,
  Document as DocumentAst,
  Node as NodeAst,
} from 'parse5';
import { Plugin } from '../Plugin';
import { createBabelTransform, defaultConfig } from '../utils/babel-transform';

export type ResolveImport = (source: string) => string | undefined | Promise<string | undefined>;

interface ParsedImport {
  s: number;
  e: number;
  ss: number;
  se: number;
  d: number;
}

const CONCAT_NO_PACKAGE_ERROR =
  'Dynamic import with a concatenated string should start with a valid full package name.';

const babelTransform = createBabelTransform(
  // @ts-ignore
  deepmerge(defaultConfig, {
    babelrc: false,
    configFile: false,
  }),
);

async function createSyntaxError(code: string, filePath: string, originalError: Error) {
  // if es-module-lexer cannot parse the file, use babel to generate a user-friendly error message
  await babelTransform(filePath, code);
  // ResolveSyntaxError is thrown when resolveModuleImports runs into a syntax error from
  // the lexer, but babel didn't see any errors. this means either a bug in the lexer, or
  // some experimental syntax. log a message and return the module untransformed to the
  // browser
  console.error(
    `Could not resolve module imports in ${filePath}: Unable to parse the module, this can be due to experimental syntax or a bug in the parser.`,
  );
  throw originalError;
}

/**
 * Resolves an import which is a concatenated string (for ex. import('my-package/files/${filename}'))
 *
 * Resolving is done by taking the package name and resolving that, then prefixing the resolves package
 * to the import. This requires the full package name to be present in the string.
 */
async function resolveConcatenatedImport(
  importSpecifier: string,
  resolveImport: ResolveImport,
): Promise<string> {
  let pathToResolve = importSpecifier;
  let pathToAppend = '';

  const parts = importSpecifier.split('/');
  if (importSpecifier.startsWith('@')) {
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

  // TODO: instead of package, we could resolve the bare import and take the first one or two segments
  // this will make it less hardcoded to node resolution
  const packagePath = `${pathToResolve}/package.json`;
  const resolvedPackage = await resolveImport(packagePath);
  if (!resolvedPackage) {
    throw new Error(`Could not resolve conatenated dynamic import, could not find ${packagePath}`);
  }

  const packageDir = resolvedPackage.substring(0, resolvedPackage.length - 'package.json'.length);
  return `${packageDir}${pathToAppend}`;
}

async function maybeResolveImport(
  importSpecifier: string,
  concatenatedString: boolean,
  resolveImport: ResolveImport,
) {
  let resolvedImportFilePath;

  if (concatenatedString) {
    // if this dynamic import is a concatenated string, try our best to resolve. Otherwise leave it untouched and resolve it at runtime.
    try {
      resolvedImportFilePath =
        (await resolveConcatenatedImport(importSpecifier, resolveImport)) ?? importSpecifier;
    } catch (error) {
      return importSpecifier;
    }
  } else {
    resolvedImportFilePath = (await resolveImport(importSpecifier)) ?? importSpecifier;
  }
  return resolvedImportFilePath;
}

export async function resolveModuleImports(
  code: string,
  filePath: string,
  resolveImport: ResolveImport,
) {
  let imports: ParsedImport[];
  try {
    [imports] = await parse(code, filePath);
  } catch (error) {
    throw await createSyntaxError(code, filePath, error);
  }

  let resolvedSource = '';
  let lastIndex = 0;

  for (const imp of imports) {
    const { s: start, e: end, d: dynamicImportIndex } = imp;

    if (dynamicImportIndex === -1) {
      // static import
      const importSpecifier = code.substring(start, end);
      const resolvedImport = await maybeResolveImport(importSpecifier, false, resolveImport);

      resolvedSource += `${code.substring(lastIndex, start)}${resolvedImport}`;
      lastIndex = end;
    } else if (dynamicImportIndex >= 0) {
      // dynamic import
      const dynamicStart = start + 1;
      const dynamicEnd = end - 1;

      const importSpecifier = code.substring(dynamicStart, dynamicEnd);
      const stringSymbol = code[dynamicStart - 1];
      const isStringLiteral = [`\``, "'", '"'].includes(stringSymbol);
      const concatenatedString =
        stringSymbol === `\`` || importSpecifier.includes("'") || importSpecifier.includes('"');
      const resolvedImport = isStringLiteral
        ? await maybeResolveImport(importSpecifier, concatenatedString, resolveImport)
        : importSpecifier;

      resolvedSource += `${code.substring(lastIndex, dynamicStart)}${resolvedImport}`;
      lastIndex = dynamicEnd;
    }
  }

  if (lastIndex < code.length - 1) {
    resolvedSource += `${code.substring(lastIndex, code.length)}`;
  }

  return resolvedSource;
}

async function resolveWithPluginHooks(
  context: Context,
  jsCode: string,
  rootDir: string,
  resolvePlugins: Plugin[],
) {
  const fileUrl = new URL(context.path, `${pathToFileURL(rootDir)}/`);
  const filePath = fileURLToPath(fileUrl);

  async function resolveImport(source: string) {
    for (const plugin of resolvePlugins) {
      const resolved = await plugin.resolveImport?.({ source, context });
      if (resolved) return resolved;
    }
  }

  return resolveModuleImports(jsCode, filePath, resolveImport);
}

export interface ResolveModuleImportsPlugin {
  rootDir: string;
  plugins?: Plugin[];
}

export function resolveModuleImportsPlugin(config: ResolveModuleImportsPlugin): Plugin {
  const { rootDir, plugins = [] } = config;
  const resolvePlugins = plugins.filter(pl => !!pl.resolveImport);

  return {
    async transform(context) {
      if (resolvePlugins.length === 0) {
        return;
      }

      // served JS code
      if (context.response.is('js')) {
        const bodyWithResolvedImports = await resolveWithPluginHooks(
          context,
          context.body,
          rootDir,
          resolvePlugins,
        );
        return { body: bodyWithResolvedImports };
      }

      // resolve inline scripts
      if (context.response.is('html')) {
        const documentAst = parseHtml(context.body);
        const scriptNodes = findJsScripts(documentAst, {
          jsScripts: true,
          jsModules: true,
          inlineJsScripts: true,
        });

        for (const node of scriptNodes) {
          const code = getTextContent(node);
          const resolvedCode = await resolveWithPluginHooks(context, code, rootDir, resolvePlugins);
          setTextContent(node, resolvedCode);
        }

        return { body: serializeHtml(documentAst) };
      }
    },
  };
}
