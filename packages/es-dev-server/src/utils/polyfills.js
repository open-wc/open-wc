import { compatibilityModes } from '../constants.js';

/** @type {import('@open-wc/building-utils/index-html/create-index-html').PolyfillsConfig} */
export const modernPolyfills = {
  webcomponents: true,
  esModuleShims: true,
};

/** @type {import('@open-wc/building-utils/index-html/create-index-html').PolyfillsConfig} */
export const legacyPolyfills = {
  ...modernPolyfills,
  coreJs: true,
  regeneratorRuntime: true,
  fetch: true,
  systemJsExtended: true,
};

/**
 * @param {string} compatibilityMode
 */
export function getPolyfills(compatibilityMode) {
  if (!compatibilityMode || compatibilityMode === compatibilityModes.NONE) {
    return {};
  }

  if (compatibilityMode === compatibilityModes.ALL) {
    return legacyPolyfills;
  }

  if ([compatibilityModes.MODERN, compatibilityModes.ESM].includes(compatibilityMode)) {
    return modernPolyfills;
  }

  throw new Error(`Unknown compatibility mode: ${compatibilityMode}`);
}
