/** @type {import('@open-wc/building-utils/index-html/create-index-html').PolyfillsConfig} */
const all = {
  coreJs: true,
  regeneratorRuntime: true,
  fetch: true,
  webcomponents: true,
};

/** @type {import('@open-wc/building-utils/index-html/create-index-html').PolyfillsConfig} */
const allWithSystemjs = {
  ...all,
  systemJsExtended: true,
};

export const polyfillsPresets = {
  all,
  allWithSystemjs,
};
