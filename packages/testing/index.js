import 'chai/chai.js';
import './register-chai-plugins.js';

export {
  html,
  unsafeStatic,
  triggerBlurFor,
  triggerFocusFor,
  oneEvent,
  isIE,
  defineCE,
  aTimeout,
  nextFrame,
  litFixture,
  litFixtureSync,
  fixture,
  fixtureSync,
  fixtureCleanup,
  elementUpdated,
} from '@open-wc/testing-helpers/index.js';

// @ts-ignore
const { expect, should, assert } = window.chai;
export { expect, should, assert };
