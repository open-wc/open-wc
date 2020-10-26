export { html } from '@open-wc/testing-helpers/types/index-no-side-effects';
export { unsafeStatic } from '@open-wc/testing-helpers/types/index-no-side-effects';
export { triggerBlurFor } from '@open-wc/testing-helpers/types/index-no-side-effects';
export { triggerFocusFor } from '@open-wc/testing-helpers/types/index-no-side-effects';
export { oneEvent } from '@open-wc/testing-helpers/types/index-no-side-effects';
export { isIE } from '@open-wc/testing-helpers/types/index-no-side-effects';
export { defineCE } from '@open-wc/testing-helpers/types/index-no-side-effects';
export { aTimeout } from '@open-wc/testing-helpers/types/index-no-side-effects';
export { litFixture } from '@open-wc/testing-helpers/types/index-no-side-effects';
export { litFixtureSync } from '@open-wc/testing-helpers/types/index-no-side-effects';
export { fixture } from '@open-wc/testing-helpers/types/index-no-side-effects';
export { fixtureSync } from '@open-wc/testing-helpers/types/index-no-side-effects';
export { fixtureCleanup } from '@open-wc/testing-helpers/types/index-no-side-effects';
export { elementUpdated } from '@open-wc/testing-helpers/types/index-no-side-effects';

import chai from 'chai';

type expect = typeof chai.expect;
type assert = typeof chai.assert;
type should = typeof chai.should;

declare function expect(...args: Parameters<expect>): ReturnType<expect>;
declare const assert: assert;
declare function should(...args: Parameters<should>): ReturnType<should>;

export { expect, assert, should };
