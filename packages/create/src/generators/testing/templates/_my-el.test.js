import { html, fixture, expect, nextFrame } from '@open-wc/testing';

import '../<%= tagName %>.js';

describe('<%= className %>', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture(html`
      <<%= tagName %>></<%= tagName %>>
    `);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('shows initially the text "hey there Nr. 5!" and an "increment" button', async () => {
    const el = await fixture(html`
      <<%= tagName %>></<%= tagName %>>
    `);

    expect(el).shadowDom.to.equal(`
      <h2>Hey there Nr. 5!</h2>
      <button>increment</button>
    `);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture(html`
      <<%= tagName %>></<%= tagName %>>
    `);
    el.shadowRoot.querySelector('button').click();
    await nextFrame();
    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture(html`
      <<%= tagName %> title="attribute title"></<%= tagName %>>
    `);

    expect(el.title).to.equal('attribute title');
  });
});
