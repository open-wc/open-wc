import { compatibilityModes } from '../constants.js';

/** @type {import('@open-wc/building-utils/index-html/create-index-html').PolyfillsConfig} */
export const esmPolyfills = {
  esModuleShims: true,
};

/** @type {import('@open-wc/building-utils/index-html/create-index-html').PolyfillsConfig} */
export const modernPolyfills = {
  ...esmPolyfills,
  webcomponents: true,
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
  switch (compatibilityMode) {
    case compatibilityModes.ESM:
      return esmPolyfills;
    case compatibilityModes.MODERN:
      return modernPolyfills;
    case compatibilityModes.ALL:
      return legacyPolyfills;
    default:
      return {};
  }
}
