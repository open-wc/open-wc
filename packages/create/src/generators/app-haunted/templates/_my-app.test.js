import { html, fixture, expect, nextFrame } from '@open-wc/testing';

import '../<%= tagName %>.js';

describe('<%= className %>', () => {
  it('has page "main" by default', async () => {
    const el = await fixture(html`
      <<%= tagName %>></<%= tagName %>>
    `);

    const shadow = el.shadowRoot;
    const main = shadow.querySelector('main');
    const { page } = main.dataset;

    expect(page).to.equal('main');
    expect(main).lightDom.to.equal(`
      <page-main></page-main>
    `);
  });

  it('renders page-one if page property is set to pageOne', async () => {
    const el = await fixture(html`
      <<%= tagName %> page="pageOne"></<%= tagName %>>
    `);
    expect(el.shadowRoot.querySelector('main')).lightDom.to.equal(`
      <page-one title="Hey there"></page-one>
    `);
  });

  it('changes the page if a menu link gets clicked', async () => {
    const el = await fixture(html`
      <<%= tagName %>></<%= tagName %>>
    `);
    el.shadowRoot.querySelectorAll('header a')[2].click();
    await nextFrame();
    const shadow = el.shadowRoot;
    const main = shadow.querySelector('main');
    const { page } = main.dataset;

    expect(page).to.equal('about');
  });
});
