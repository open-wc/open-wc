import './register-chai-plugins.js';

// all exports from testing-helpers, except fixture
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
  cleanupFixture,
  elementUpdated,
} from '@open-wc/testing-helpers';

// wrapped fixture, with auto cleanup
export * from './src/fixture.js';

export { chai, expect, should, assert } from '@bundled-es-modules/chai';
