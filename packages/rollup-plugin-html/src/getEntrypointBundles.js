/** @typedef {import('rollup').OutputChunk} OutputChunk */
/** @typedef {import('./types').PluginOptions} PluginOptions */
/** @typedef {import('./types').EntrypointBundle} EntrypointBundle */
/** @typedef {import('./types').GeneratedBundle} GeneratedBundle */

const path = require('path');
const { toBrowserPath } = require('@open-wc/building-utils');
const { createError } = require('./utils');

/**
 * @param {object} args
 * @param {string | undefined} [args.publicPath]
 * @param {string} args.mainOutputDir
 * @param {string} args.fileOutputDir
 * @param {string} args.htmlFileName
 * @param {string} args.fileName
 */
function createImportPath({ publicPath, mainOutputDir, fileOutputDir, htmlFileName, fileName }) {
  const pathFromMainToFileDir = path.relative(mainOutputDir, fileOutputDir);
  let importPath;
  if (publicPath) {
    importPath = toBrowserPath(path.join(publicPath, pathFromMainToFileDir, fileName));
  } else {
    const pathFromHtmlToOutputDir = path.relative(
      path.dirname(htmlFileName),
      pathFromMainToFileDir,
    );
    importPath = toBrowserPath(path.join(pathFromHtmlToOutputDir, fileName));
  }

  if (importPath.startsWith('http') || importPath.startsWith('/') || importPath.startsWith('.')) {
    return importPath;
  }
  return `./${importPath}`;
}

/**
 * @param {object} args
 * @param {PluginOptions} args.pluginOptions
 * @param {GeneratedBundle[]} args.generatedBundles
 * @param {string} args.mainOutputDir
 * @param {string | undefined} [args.htmlFileName]
 * @param {string[] | undefined} [args.inputModuleIds]
 */
function getEntrypointBundles({
  pluginOptions,
  generatedBundles,
  inputModuleIds,
  mainOutputDir,
  htmlFileName,
}) {
  /** @type {Record<string, EntrypointBundle>} */
  const entrypointBundles = {};

  for (const { name, options, bundle } of generatedBundles) {
    if (!options.format) throw createError('Missing module format');

    /** @type {{ importPath: string, chunk: OutputChunk }[]} */
    const entrypoints = [];
    for (const chunkOrAsset of Object.values(bundle)) {
      if (chunkOrAsset.type === 'chunk') {
        const chunk = /** @type {OutputChunk} */ (chunkOrAsset);
        if (chunk.isEntry) {
          if (
            !inputModuleIds ||
            (chunk.facadeModuleId && inputModuleIds.includes(chunk.facadeModuleId))
          ) {
            const importPath = createImportPath({
              publicPath: pluginOptions.publicPath,
              mainOutputDir,
              fileOutputDir: options.dir || '',
              htmlFileName,
              fileName: chunkOrAsset.fileName,
            });
            entrypoints.push({ importPath, chunk: chunkOrAsset });
          }
        }
      }
    }
    entrypointBundles[name] = { name, options, bundle, entrypoints };
  }

  return entrypointBundles;
}

module.exports = { getEntrypointBundles, createImportPath };
