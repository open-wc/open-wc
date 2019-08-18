import 'chai/chai.js';

export {
  html,
  unsafeStatic,
  triggerBlurFor,
  triggerFocusFor,
  oneEvent,
  isIE,
  defineCE,
  aTimeout,
  litFixture,
  litFixtureSync,
  fixture,
  fixtureSync,
  fixtureCleanup,
  elementUpdated,
} from '@open-wc/testing-helpers/index-no-side-effects.js';

// @ts-ignore
export const { expect, should, assert } = window.chai;
