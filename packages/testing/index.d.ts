/// <reference path="./register-chai-plugins.d.ts" />

export { html } from '@open-wc/testing-helpers';
export { unsafeStatic } from '@open-wc/testing-helpers';
export { triggerBlurFor } from '@open-wc/testing-helpers';
export { triggerFocusFor } from '@open-wc/testing-helpers';
export { oneEvent } from '@open-wc/testing-helpers';
export { isIE } from '@open-wc/testing-helpers';
export { defineCE } from '@open-wc/testing-helpers';
export { aTimeout } from '@open-wc/testing-helpers';
export { nextFrame } from '@open-wc/testing-helpers';
export { litFixture } from '@open-wc/testing-helpers';
export { litFixtureSync } from '@open-wc/testing-helpers';
export { fixture } from '@open-wc/testing-helpers';
export { fixtureSync } from '@open-wc/testing-helpers';
export { fixtureCleanup } from '@open-wc/testing-helpers';
export { elementUpdated } from '@open-wc/testing-helpers';
export { waitUntil } from '@open-wc/testing-helpers';

import Chai from 'chai';

export declare const chai: typeof Chai;
export declare const expect: typeof Chai.expect;
export declare const assert: typeof Chai.assert;
export declare const should: typeof Chai.should;
