import {
  html,
  htmlFixture,
  litHtmlFixture,
} from '@open-wc/testing/bdd.js';

import '../<%= tagName %>';

describe('<<%= tagName %>>', () => {
  it('has a default property header', async () => {
    const el = await htmlFixture('<<%= tagName %>></<%= tagName %>>');
    expect(el.header).to.equal('My Example');
  });

  it('allows property header to be overwritten', async () => {
    const el = await litHtmlFixture(html`
      <<%= tagName %> .header=${'different'}></<%= tagName %>>
    `);
    expect(el.header).to.equal('different');
  });
});
