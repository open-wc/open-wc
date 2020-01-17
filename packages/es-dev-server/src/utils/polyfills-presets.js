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

/**
 * In max compatibility mode, we need to load the regenerator runtime on all browsers since
 * we're always compiling to es5.
 */
const max = {
  ...allWithSystemjs,
  regeneratorRuntime: 'always',
};

export const polyfillsPresets = {
  all,
  max,
  allWithSystemjs,
};
