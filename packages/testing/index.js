// remove esline-disable when https://github.com/esm-bundle/chai/pull/61 is merged
/* eslint-disable-next-line import/no-unresolved */
import chai, { expect, should, assert } from '@esm-bundle/chai';
import './register-chai-plugins.js';

export { chai, expect, should, assert };

export {
  html,
  unsafeStatic,
  triggerBlurFor,
  triggerFocusFor,
  oneEvent,
  oneDefaultPreventedEvent,
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
  waitUntil,
} from '@open-wc/testing-helpers';
