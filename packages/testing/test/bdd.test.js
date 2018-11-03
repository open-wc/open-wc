/* eslint-disable no-unused-expressions */

import { cachedWrappers } from '@open-wc/testing-helpers/htmlFixture.js';
import {
  htmlFixture,
} from '../index.js';

describe('BDD', () => {
  it('can use htmlFixture', async () => {
    const el = await htmlFixture('<div class="el1"></div>');
    const el2 = await htmlFixture('<div class="el2"></div>');
    expect(el).to.not.be.undefined;
    expect(el2).to.not.be.undefined;
  });

  it('will cleanup after each test', async () => {
    expect(cachedWrappers.length).to.equal(0);
  });

  it('uses chai dom equals plugin', async () => {
    const el = await htmlFixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).dom.to.semantically.equal('<div><h1>Hey</h1></div>');
  });
});
