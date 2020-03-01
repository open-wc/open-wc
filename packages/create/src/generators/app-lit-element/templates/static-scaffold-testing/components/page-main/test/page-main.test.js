import { html, fixture, expect } from '@open-wc/testing';

import '../page-main.js';

describe('PageMain', () => {
  it('has a default title "Hello open-wc world!"', async () => {
    const el = await fixture(html`
      <page-main></page-main>
    `);

    expect(el.title).to.equal('Hello open-wc world!');
  });

  it('can override the title via attribute', async () => {
    const el = await fixture(html`
      <page-main title="attribute title"></page-main>
    `);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture(html`
      <page-main title="attribute title"></page-main>
    `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
