import { html, fixture, expect } from '@open-wc/testing';

import '../src/<%= tagName %>';

describe('<<%= tagName %>>', () => {
  it('has a default property header', async () => {
    const el = await fixture('<<%= tagName %>></<%= tagName %>>');
    expect(el.title).to.equal('open-wc');
  });

  it('allows property header to be overwritten', async () => {
    const el = await fixture(html`
      <<%= tagName %> title="different"></<%= tagName %>>
    `);
    expect(el.title).to.equal('different');
  });
});
