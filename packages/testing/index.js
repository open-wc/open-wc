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
} from '@open-wc/testing-helpers/index.js';

export { chai, expect, should, assert } from '@bundled-es-modules/chai';
