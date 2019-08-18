/** @type Set<Element> */
export const wrappers = new Set();

const fixtureContainer = document.createElement('div');
fixtureContainer.id = 'testFixtures';
fixtureContainer.style.position = 'absolute';
fixtureContainer.style.top = '0';
fixtureContainer.style.left = '0';
fixtureContainer.style.backgroundColor = 'white';
fixtureContainer.style.boxShadow = '0 0 6px 0 rgba(0, 0, 0, 0.12), 0 6px 6px 0 rgba(0, 0, 0, 0.24)';

document.body.appendChild(fixtureContainer);

/**
 * Creates a wrapper node for test fixtures, so that we can keep track of
 * the test fixtures.
 *
 * @returns {Element}
 */
export function createFixtureWrapper() {
  const wrapper = document.createElement('div');
  fixtureContainer.appendChild(wrapper);
  wrappers.add(wrapper);
  return wrapper;
}

/**
 * Cleans up a test fixture, identified by the first rendered element
 * @param {*} fixtureFirstChildElement
 */
export function cleanupFixture(fixtureFirstChildElement) {
  wrappers.forEach(wrapper => {
    if (wrapper.firstElementChild === fixtureFirstChildElement) {
      fixtureContainer.removeChild(wrapper);
      wrappers.delete(wrapper);
    }
  });
}
