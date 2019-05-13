import { html, fixture, expect } from '@open-wc/testing';

import '../src/<%= tagName %>.js';

describe('<<%= tagName %>>', () => {
  it('has a default property heading', async () => {
    const el = await fixture('<<%= tagName %>></<%= tagName %>>');

    expect(el.heading).to.equal('Hello world!');
  });

  it('allows property heading to be overwritten', async () => {
    const el = await fixture(html`
      <<%= tagName %> heading="different heading"></<%= tagName %>>
    `);

    expect(el.heading).to.equal('different heading');
  });
});
