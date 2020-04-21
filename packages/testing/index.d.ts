/// <reference path="./register-chai-plugins.d.ts" />

export { html } from '@open-wc/testing-helpers/index.js';
export { unsafeStatic } from '@open-wc/testing-helpers/index.js';
export { triggerBlurFor } from '@open-wc/testing-helpers/index.js';
export { triggerFocusFor } from '@open-wc/testing-helpers/index.js';
export { oneEvent } from '@open-wc/testing-helpers/index.js';
export { isIE } from '@open-wc/testing-helpers/index.js';
export { defineCE } from '@open-wc/testing-helpers/index.js';
export { aTimeout } from '@open-wc/testing-helpers/index.js';
export { nextFrame } from '@open-wc/testing-helpers/index.js';
export { litFixture } from '@open-wc/testing-helpers/index.js';
export { litFixtureSync } from '@open-wc/testing-helpers/index.js';
export { fixture } from '@open-wc/testing-helpers/index.js';
export { fixtureSync } from '@open-wc/testing-helpers/index.js';
export { fixtureCleanup } from '@open-wc/testing-helpers/index.js';
export { elementUpdated } from '@open-wc/testing-helpers/index.js';
export { waitUntil } from '@open-wc/testing-helpers/index.js';

import chai from 'chai';

export declare const expect: typeof chai.expect;
export declare const assert: typeof chai.assert;
export declare const should: typeof chai.should;
