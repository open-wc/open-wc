import { html, fixture, expect } from '@open-wc/testing';

import '../<%= tagName %>.js';

describe('<<%= tagName %>>', () => {
  it('has a default property title', async () => {
    const el = await fixture('<<%= tagName %>></<%= tagName %>>');

    expect(el.title).to.equal('Hello world!');
  });

  it('allows property title to be overwritten', async () => {
    const el = await fixture(html`
      <<%= tagName %> title="different title"></<%= tagName %>>
    `);

    expect(el.title).to.equal('different title');
  });
});
