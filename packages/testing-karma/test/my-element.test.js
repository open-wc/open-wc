import { fixture, expect, html } from '@open-wc/testing';
import '../demo/my-element.js';

describe('my-element', () => {
  it('renders correctly', async () => {
    const element = await fixture(
      html`
        <my-element></my-element>
      `,
    );
    // @ts-ignore
    await element.getMessage();

    expect(element).shadowDom.to.equalSnapshot();
  });
});
