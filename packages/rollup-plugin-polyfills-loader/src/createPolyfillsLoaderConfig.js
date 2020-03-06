/** @typedef {import ('@open-wc/rollup-plugin-html').EntrypointBundle} EntrypointBundle */
/** @typedef {import('polyfills-loader').PolyfillsLoaderConfig} PolyfillsLoaderConfig */
/** @typedef {import('polyfills-loader').LegacyEntrypoint} LegacyEntrypoint */
/** @typedef {import('rollup').ModuleFormat} ModuleFormat */
/** @typedef {import('./types').PluginOptions} PluginOptions */

const { fileTypes } = require('polyfills-loader');
const { createError } = require('./utils');

/**  @param {ModuleFormat} [format] */
function formatToFilyType(format) {
  switch (format) {
    case 'es':
    case 'esm':
    case 'module':
      return fileTypes.MODULE;
    case 'system':
      return fileTypes.SYSTEMJS;
    default:
      return fileTypes.SCRIPT;
  }
}

/**  @param {string} name */
function bundleNotFoundError(name) {
  return createError(`Could not find any @open-wc/rollup-plugin-html output named ${name}.`);
}

/** @param {EntrypointBundle} bundle */
function createEntrypoints(bundle) {
  const type = formatToFilyType(bundle.options.format);
  const files = bundle.entrypoints.map(e => ({ type, path: e.importPath }));
  return { files };
}

/**
 * @param {EntrypointBundle} bundle
 * @param {string} test
 */
function createLegacyEntrypoints(bundle, test) {
  return { ...createEntrypoints(bundle), test };
}

/**
 * @param {PluginOptions} pluginOptions
 * @param {EntrypointBundle} [bundle]
 * @param {Record<string, EntrypointBundle>} [bundles]
 * @returns {PolyfillsLoaderConfig}
 */
function createPolyfillsLoaderConfig(pluginOptions, bundle, bundles) {
  const { modernOutput, legacyOutput, polyfills } = pluginOptions;
  let modern;
  let legacy;

  // @open-wc/rollup-plugin-html outputs `bundle` when there is a single output,
  // otherwise it outputs `bundles`

  if (bundle) {
    if (modernOutput || legacyOutput) {
      throw createError(
        'Options modernOutput or legacyOutput was set, but @open-wc/rollup-plugin-html' +
          ` did not output multiple builds. Make sure you use html.addOutput('my-output') for each rollup output.`,
      );
    }

    modern = createEntrypoints(bundle);
  } else {
    if (!bundles || Object.keys(bundles).length === 0) {
      throw createError(
        '@open-wc/rollup-plugin-html did not output any bundles to ' +
          `be injected in the HTML file ${pluginOptions.htmlFileName}`,
      );
    }

    if (!modernOutput || !legacyOutput) {
      throw createError(
        'Rollup is configured to output multiple builds, set the modernOutput and legacyOutput options' +
          ' to configure how they should be loaded by the polyfills loader.',
      );
    }

    if (!bundles[modernOutput]) throw bundleNotFoundError(modernOutput);
    modern = createEntrypoints(bundles[modernOutput]);

    /** @type {LegacyEntrypoint[]} */
    legacy = [];
    const legacyOutputIterator = Array.isArray(legacyOutput) ? legacyOutput : [legacyOutput];
    for (const output of legacyOutputIterator) {
      if (!bundles[output.name]) throw bundleNotFoundError(output.name);

      const entrypoint = createLegacyEntrypoints(bundles[output.name], output.test);
      legacy.push(entrypoint);
    }
  }

  return { modern, legacy, polyfills };
}

module.exports = { createPolyfillsLoaderConfig };
