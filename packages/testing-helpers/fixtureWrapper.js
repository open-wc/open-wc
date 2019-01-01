/** @type Array<Element> */
export const cachedWrappers = [];

/**
 * Creates a wrapper as a direct child of `<body>` to put the tested element into.
 * Needed to run a `connectedCallback()` on a tested element.
 *
 * @returns {Element}
 * @private
 */
export function fixtureWrapper() {
  const wrapper = document.createElement('div');
  document.body.appendChild(wrapper);
  cachedWrappers.push(wrapper);
  return wrapper;
}
