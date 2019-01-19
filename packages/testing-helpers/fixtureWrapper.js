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

/**
 * Cleans up all defined fixtures
 */
export function fixtureCleanup() {
  if (cachedWrappers) {
    cachedWrappers.forEach(wrapper => {
      document.body.removeChild(wrapper);
    });
  }
  cachedWrappers.length = 0; // reset it like this as we can't reassign it
}
