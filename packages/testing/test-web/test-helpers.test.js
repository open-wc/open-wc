import { fixture, expect } from '../index.js';

describe('Test Helpers', () => {
  it('can use fixture', async () => {
    const el = await fixture('<div class="el1"></div>');
    const el2 = await fixture('<div class="el2"></div>');
    expect(el).to.not.be.undefined;
    expect(el2).to.not.be.undefined;
  });
});
