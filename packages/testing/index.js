import * as chai from 'chai';
import './register-chai-plugins.js';

const { expect, should, assert } = chai;

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
