export const compatibilityModes = {
  NONE: 'none',
  ESM: 'esm',
  MODERN: 'modern',
  ALL: 'all',
};

export const messageChannelEndpoint = '/__es-dev-server-message-channel__';

export const baseFileExtensions = ['.js', '.mjs'];

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
