import {
  html,
  fixture,
  litFixture,
  expect,
} from '@open-wc/testing';

import '../<%= tagName %>';

describe('<<%= tagName %>>', () => {
  it('has a default property header', async () => {
    const el = await fixture('<<%= tagName %>></<%= tagName %>>');
    expect(el.header).to.equal('My Example');
  });

  it('allows property header to be overwritten', async () => {
    const el = await litFixture(html`
      <<%= tagName %> .header=${'different'}></<%= tagName %>>
    `);
    expect(el.header).to.equal('different');
  });
});
