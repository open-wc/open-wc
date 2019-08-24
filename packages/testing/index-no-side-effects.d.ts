export { html } from '@open-wc/testing-helpers/index-no-side-effects.js';
export { unsafeStatic } from '@open-wc/testing-helpers/index-no-side-effects.js';
export { triggerBlurFor } from '@open-wc/testing-helpers/index-no-side-effects.js';
export { triggerFocusFor } from '@open-wc/testing-helpers/index-no-side-effects.js';
export { oneEvent } from '@open-wc/testing-helpers/index-no-side-effects.js';
export { isIE } from '@open-wc/testing-helpers/index-no-side-effects.js';
export { defineCE } from '@open-wc/testing-helpers/index-no-side-effects.js';
export { aTimeout } from '@open-wc/testing-helpers/index-no-side-effects.js';
export { litFixture } from '@open-wc/testing-helpers/index-no-side-effects.js';
export { litFixtureSync } from '@open-wc/testing-helpers/index-no-side-effects.js';
export { fixture } from '@open-wc/testing-helpers/index-no-side-effects.js';
export { fixtureSync } from '@open-wc/testing-helpers/index-no-side-effects.js';
export { fixtureCleanup } from '@open-wc/testing-helpers/index-no-side-effects.js';
export { elementUpdated } from '@open-wc/testing-helpers/index-no-side-effects.js';

import chai from 'chai';

type expect = typeof chai.expect;
type assert = typeof chai.assert;
type should = typeof chai.should;

declare function expect(...args: Parameters<expect>): ReturnType<expect>;
declare const assert: assert;
declare function should(...args: Parameters<should>): ReturnType<should>;

export { expect, assert, should };
