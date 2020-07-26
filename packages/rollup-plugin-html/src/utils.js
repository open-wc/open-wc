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
        ...fromEntries(inputModuleIds.map(i => [i.split('/').slice(-1)[0].split('.')[0], i])),
      },
    };
  }

  throw createError(`Unknown rollup input type. Supported inputs are string, array and object.`);
}

/**
 * @param {InputOptions} rollupInputOptions
 * @param {PluginOptions} pluginOptions
 */
function shouldReadInputFromRollup(rollupInputOptions, pluginOptions) {
  return (
    typeof rollupInputOptions.input === 'string' &&
    rollupInputOptions.input.endsWith('.html') &&
    !pluginOptions.html &&
    !pluginOptions.files
  );
}

module.exports = {
  createError,
  fromEntries,
  addRollupInput,
  shouldReadInputFromRollup,
};
