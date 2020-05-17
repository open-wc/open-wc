import createRollupResolve, { Options } from '@rollup/plugin-node-resolve';
import path from 'path';
import { URL, pathToFileURL, fileURLToPath } from 'url';
import whatwgUrl from 'whatwg-url';
import { Plugin } from '../Plugin';
import { toBrowserPath } from '../utils/utils';

const nodeResolvePackageJson = require('@rollup/plugin-node-resolve/package.json');

const fakePluginContext = {
  meta: {
    rollupVersion: nodeResolvePackageJson.peerDependencies.rollup,
  },
  warn(...msg: string[]) {
    console.warn('[es-dev-server] node-resolve: ', ...msg);
  },
};

interface NodeResolveConfig {
  rootDir: string;
  fileExtensions: string[];
  nodeResolve: boolean | Options;
}

export function nodeResolvePlugin(config: NodeResolveConfig): Plugin {
  const { fileExtensions, rootDir } = config;
  const options = {
    rootDir,
    // allow resolving polyfills for nodejs libs
    preferBuiltins: false,
    extensions: fileExtensions,
    ...(typeof config.nodeResolve === 'object' ? config.nodeResolve : {}),
  };
  const nodeResolve = createRollupResolve(options);

  // call buildStart
  const preserveSymlinks = options?.customResolveOptions?.preserveSymlinks;
  nodeResolve.buildStart?.call(fakePluginContext as any, { preserveSymlinks });

  return {
    async serverStart({ config }) {},

    async resolveImport({ source, context }) {
      if (whatwgUrl.parseURL(source) != null) {
        // don't resolve urls
        return source;
      }
      const [withoutHash, hash] = source.split('#');
      const [importPath, params] = withoutHash.split('?');

      const relativeImport = importPath.startsWith('.') || importPath.startsWith('/');
      const jsFileImport = fileExtensions.includes(path.extname(importPath));
      // for performance, don't resolve relative imports of js files. we only do this for js files,
      // because an import like ./foo/bar.css might actually need to resolve to ./foo/bar.css.js
      if (relativeImport && jsFileImport) {
        return source;
      }

      const requestedFile = context.path.endsWith('/') ? `${context.path}index.html` : context.path;
      const fileUrl = new URL(`.${requestedFile}`, `${pathToFileURL(rootDir)}/`);
      const filePath = fileURLToPath(fileUrl);

      // do the actual resolve using the rolluo plugin
      const result = await nodeResolve.resolveId?.call(
        fakePluginContext as any,
        importPath,
        filePath,
      );
      let resolvedImportFilePath;

      if (result) {
        if (typeof result === 'string') {
          resolvedImportFilePath = result;
        } else if (typeof result.id === 'string') {
          resolvedImportFilePath = result.id;
        }
      }

      if (!resolvedImportFilePath) {
        throw new Error(
          `Could not resolve import "${importPath}" in "${path.relative(
            process.cwd(),
            filePath,
          )}".`,
        );
      }

      const resolveRelativeTo = path.extname(filePath) ? path.dirname(filePath) : filePath;
      const relativeImportFilePath = path.relative(resolveRelativeTo, resolvedImportFilePath);
      const suffix = `${params ? `?${params}` : ''}${hash ? `#${hash}` : ''}`;
      const resolvedImportPath = `${toBrowserPath(relativeImportFilePath)}${suffix}`;
      return resolvedImportPath.startsWith('/') || resolvedImportPath.startsWith('.')
        ? resolvedImportPath
        : `./${resolvedImportPath}`;
    },
  };
}
