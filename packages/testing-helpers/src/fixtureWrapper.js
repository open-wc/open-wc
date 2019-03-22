/** @type Array<Element> */
export const cachedWrappers = [];

/**
 * Creates a wrapper as a direct child of `<body>` to put the tested element into.
 * Need to be in the DOM to test for example `connectedCallback()` on elements.
 *
 * @returns {Element}
 */
export function fixtureWrapper() {
  const wrapper = document.createElement('div');
  document.body.appendChild(wrapper);
  cachedWrappers.push(wrapper);
  return wrapper;
}

/**
 * Cleans up all defined fixtures by removing the actual wrapper nodes.
 * Common usecase is at the end of each test.
 */
export function fixtureCleanup() {
  if (cachedWrappers) {
    cachedWrappers.forEach(wrapper => {
      document.body.removeChild(wrapper);
    });
  }
  cachedWrappers.length = 0; // reset it like this as we can't reassign it
}
