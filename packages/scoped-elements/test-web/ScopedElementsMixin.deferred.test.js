class FeatureA extends HTMLElement {}

describe('ScopedElementsMixin', () => {
  it('should patch HTMLElements created before applying the polyfill if required', async () => {
    const { ScopedElementsMixin } = await import('../src/ScopedElementsMixin.js');
    const { LitElement, html } = await import('lit');
    const { defineCE, fixture } = await import('@open-wc/testing-helpers');
    const { expect } = await import('@open-wc/testing');

    const tagString = defineCE(
      class extends ScopedElementsMixin(LitElement) {
        static get scopedElements() {
          return {
            'feature-a': FeatureA,
          };
        }

        render() {
          return html` <feature-a></feature-a> `;
        }
      },
    );
    const el = await fixture(`<${tagString}></${tagString}>`);
    expect(el.shadowRoot.children[0]).to.be.an.instanceOf(FeatureA);
  });
});
