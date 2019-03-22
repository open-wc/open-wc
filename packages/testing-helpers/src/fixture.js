import { fixtureCleanup } from './fixtureWrapper.js';

export { fixture, fixtureSync } from './fixture-no-side-effect.js';

/**
 * This registers the fixture cleanup as a side effect
 */
try {
  if (afterEach) {
    afterEach(() => {
      fixtureCleanup();
    });
  }
} catch (error) {
  /* do nothing */
}
