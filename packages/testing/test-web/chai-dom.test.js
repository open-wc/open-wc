import { fixture, expect } from '../index.js';

describe('Plugin - chai-dom', () => {
  it('can check for an exiting css class', async () => {
    const el = await fixture(`<div class="foo bar"></div>`);
    expect(el).to.have.class('foo');
  });
});
