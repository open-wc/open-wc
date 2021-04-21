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
  waitUntil,
} from '@open-wc/testing-helpers/index-no-side-effects.js';

// @ts-ignore
const { expect, assert, should } = window.chai;
export { expect, assert, should };
