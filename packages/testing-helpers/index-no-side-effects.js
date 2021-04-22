import { html, unsafeStatic } from 'lit/static-html.js';

export { elementUpdated } from './src/elementUpdated.js';
export { fixture, fixtureSync } from './src/fixture-no-side-effect.js';
export { cachedWrappers, fixtureCleanup, fixtureWrapper } from './src/fixtureWrapper.js';
export {
  aTimeout,
  defineCE,
  isIE,
  nextFrame,
  oneEvent,
  triggerBlurFor,
  triggerFocusFor,
  waitUntil,
} from './src/helpers.js';

export { litFixture, litFixtureSync } from './src/litFixture.js';
export { stringFixture, stringFixtureSync } from './src/stringFixture.js';

/** @deprecated please do import { html } from 'lit/static-html.js'; */
const deprecatedHtml = html;

/** @deprecated please do import { unsafeStatic } from 'lit/static-html.js'; */
const deprecatedUnsafeStatic = unsafeStatic;

export { deprecatedHtml as html, deprecatedUnsafeStatic as unsafeStatic };
