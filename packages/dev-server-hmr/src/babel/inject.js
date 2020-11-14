/** @typedef {import('@babel/types').Program} Program */
/** @typedef {import('./babelPluginWcHmr').BabelPluginWcHmrOptions} BabelPluginWcHmrOptions */
/** @template T @typedef {import('@babel/core').NodePath<T>} NodePath<T> */

const { parse } = require('@babel/core');
const { WC_HMR_NAMESPACE, WC_HMR_MODULE_PATCH, WC_HMR_MODULE_RUNTIME } = require('../constants');

/**
 * @template T
 * @param {NodePath<T>} nodePath
 * @param {string} name
 * @param {boolean} insertAfter
 */
function injectRegisterClass(nodePath, name, insertAfter) {
  const toInject = parse(`${WC_HMR_NAMESPACE}.register(import.meta.url, ${name})`);
  if (!toInject) throw new TypeError('Failed to parse');
  if (insertAfter) {
    nodePath.insertAfter(toInject);
  } else {
    nodePath.insertBefore(toInject);
  }
}

/**
 * @param {BabelPluginWcHmrOptions} options
 * @param {NodePath<Program>} program
 */
function injectRuntime(options, program) {
  const patch =
    options.patches && options.patches.length > 0 ? `import '${WC_HMR_MODULE_PATCH}'; ` : '';
  const toInject = parse(
    `${patch}import * as ${WC_HMR_NAMESPACE} from '${WC_HMR_MODULE_RUNTIME}'; if(import.meta.hot) { import.meta.hot.accept(); }`,
  );

  if (toInject) {
    program.node.body.unshift(/** @type {any} */ (toInject));
  }
}

module.exports = { injectRegisterClass, injectRuntime };
