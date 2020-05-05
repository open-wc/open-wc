import { html, fixture, expect } from '@open-wc/testing';

import { AsdAsd } from '../src/AsdAsd.js';
import '../src/asd-asd.js';

describe('AsdAsd', () => {
  let element: AsdAsd;
  beforeEach(async () => {
    element = await fixture(html` <asd-asd></asd-asd> `);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
