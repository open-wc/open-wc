/** @typedef {import('rollup').InputOptions} InputOptions */
/** @typedef {import('./types').PluginOptions} PluginOptions */
/** @typedef {import('./types').GeneratedBundle} GeneratedBundle */

const PLUGIN = '[rollup-plugin-html]';

/**
 * @param {string} msg
 */
function createError(msg) {
  return new Error(`${PLUGIN} ${msg}`);
}

/**
 * Object.fromEntries polyfill.
 * @template V
 * @param {[string, V][]} entries
 */
function fromEntries(entries) {
  /** @type {Record<string, V>} */
  const obj = {};
  for (const [k, v] of entries) {
    obj[k] = v;
  }
  return obj;
}

/**
 * @param {PluginOptions} pluginOptions
 * @param {GeneratedBundle[]} generatedBundles
 * @returns {string}
 */
function getMainOutputDir(pluginOptions, generatedBundles) {
  const mainOutputDir =
    // user defined output dir
    pluginOptions.dir ||
    // if no used defined output dir, we find the "lowest" output dir, ex. if there are
    // "dist/legacy" and "dist", we take "dist"
    generatedBundles.map(b => b.options.dir).sort((a, b) => (a && b ? a.length - b.length : 0))[0];

  if (typeof mainOutputDir !== 'string')
    throw createError(
      "Rollup must be configured to output in a directory: html({ outputDir: 'dist' })",
    );
  return mainOutputDir;
}

/**
 * @param {InputOptions} inputOptions
 * @param {string[]} inputModuleIds
 * @returns {InputOptions}
 */
function addRollupInput(inputOptions, inputModuleIds) {
  // Add input module ids to existing input option, whether it's a string, array or object
  // this way you can use multiple html plugins all adding their own inputs
  if (!inputOptions.input) {
    return { ...inputOptions, input: inputModuleIds };
  }

  if (typeof inputOptions.input === 'string') {
    return { ...inputOptions, input: [inputOptions.input, ...inputModuleIds] };
  }

  if (Array.isArray(inputOptions.input)) {
    return { ...inputOptions, input: [...inputOptions.input, ...inputModuleIds] };
  }

  if (typeof inputOptions.input === 'object') {
    return {
      ...inputOptions,
      input: {
        ...inputOptions.input,
        ...fromEntries(inputModuleIds.map(i => [i, i])),
      },
    };
  }

  throw createError(`Unknown rollup input type. Supported inputs are string, array and object.`);
}

/**
 * @param {PluginOptions} pluginOptions
 * @param {string} [inputHtmlName]
 */
function getOutputHtmlFileName(pluginOptions, inputHtmlName) {
  if (pluginOptions.name) {
    return pluginOptions.name;
  }
  return inputHtmlName || 'index.html';
}

module.exports = {
  createError,
  getMainOutputDir,
  fromEntries,
  addRollupInput,
  getOutputHtmlFileName,
};
