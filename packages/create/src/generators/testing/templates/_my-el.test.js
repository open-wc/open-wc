import { html, fixture, expect } from '@open-wc/testing';

import '../src/<%= tagName %>.js';

describe('<<%= tagName %>>', () => {
  it('has a default property header', async () => {
    const el = await fixture('<<%= tagName %>></<%= tagName %>>');
    expect(el.header).to.equal('My Example');
  });

  it('allows property header to be overwritten', async () => {
    const el = await fixture(html`
      <<%= tagName %> .header=${'different'}></<%= tagName %>>
    `);
    expect(el.header).to.equal('different');
  });
});
