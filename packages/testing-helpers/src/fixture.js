import { fixtureCleanup } from './fixtureWrapper.js';

export { fixture, fixtureSync } from './fixture-no-side-effect.js';

/**
 * This registers the fixture cleanup as a side effect
 */
try {
  // we should not assume that our users load mocha types globally
  // @ts-ignore
  if (afterEach) {
    // @ts-ignore
    afterEach(() => {
      fixtureCleanup();
    });
  }
} catch (error) {
  /* do nothing */
}
