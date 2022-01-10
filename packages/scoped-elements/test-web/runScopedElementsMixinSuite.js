import { expect, fixture, defineCE, waitUntil } from '@open-wc/testing';
import { LitElement, html, css } from 'lit';
import { until } from 'lit/directives/until.js';

import { ScopedElementsMixin } from '../index.js';

export function runScopedElementsMixinSuite({ label }) {
  class FeatureA extends LitElement {
    render() {
      return html` <div>Element A</div> `;
    }
  }

  class FeatureB extends LitElement {
    render() {
      return html` <div>Element B</div> `;
    }
  }

  describe(label, () => {
    it('has a default value for "static get scopedElements()" of {}', async () => {
      const tag = defineCE(class extends ScopedElementsMixin(LitElement) {});
      const el = await fixture(`<${tag}></${tag}>`);
      expect(el.constructor.scopedElements).to.deep.equal({});
    });

    it('will not fail if there is no "static get scopedElements()"', async () => {
      const tag = defineCE(
        class ContainerElement extends ScopedElementsMixin(LitElement) {
          render() {
            return html` <feature-a></feature-a><feature-b></feature-b> `;
          }
        },
      );
      const el = await fixture(`<${tag}></${tag}>`);
      // not upgraded custom elements are normal dom element e.g. HTMLElement
      expect(el.shadowRoot.children[0]).to.be.an.instanceOf(HTMLElement);
      expect(el.shadowRoot.children[1]).to.be.an.instanceOf(HTMLElement);
    });

    it('supports elements define in "static get scopedElements()"', async () => {
      const tagString = defineCE(
        class extends ScopedElementsMixin(LitElement) {
          static get scopedElements() {
            return {
              'feature-a': FeatureA,
              'feature-b': FeatureB,
            };
          }

          render() {
            return html` <feature-a></feature-a><feature-b></feature-b> `;
          }
        },
      );
      const el = await fixture(`<${tagString}></${tagString}>`);
      expect(el.shadowRoot.children[0]).to.be.an.instanceOf(FeatureA);
      expect(el.shadowRoot.children[1]).to.be.an.instanceOf(FeatureB);
    });

    it('supports to extend as ScopedElements component without defining unused sub components', async () => {
      class FeatureC extends LitElement {
        render() {
          return html` <div>Element C</div> `;
        }
      }

      class FeatureD extends LitElement {
        render() {
          return html` <div>Element D</div> `;
        }
      }

      class PageA extends ScopedElementsMixin(LitElement) {
        static get scopedElements() {
          return {
            'feature-c': FeatureC,
            'feature-d': FeatureD,
          };
        }

        render() {
          return html`
            <feature-c></feature-c>
            <feature-d></feature-d>
          `;
        }
      }

      const tag = defineCE(
        class extends ScopedElementsMixin(PageA) {
          render() {
            return html` <feature-c></feature-c> `;
          }
        },
      );
      const el = await fixture(`<${tag}></${tag}>`);

      expect(el.shadowRoot.children[0]).to.be.an.instanceOf(FeatureC);
    });

    it('supports lazy loaded elements', async () => {
      class FeatureLazyB extends FeatureB {}

      const tag = defineCE(
        class extends ScopedElementsMixin(LitElement) {
          static get scopedElements() {
            return {
              'feature-a': FeatureA,
            };
          }

          render() {
            return html`
              <feature-a></feature-a>
              <feature-lazy-b></feature-lazy-b>
              <feature-c></feature-c>
            `;
          }
        },
      );

      const el = await fixture(`<${tag}></${tag}>`);

      expect(el.shadowRoot.children[0]).to.be.an.instanceOf(FeatureA);
      expect(el.shadowRoot.children[1]).to.not.be.an.instanceOf(FeatureLazyB);
      expect(el.shadowRoot.children[2]).to.not.undefined;

      el.defineScopedElement('feature-lazy-b', FeatureLazyB);

      expect(el.shadowRoot.children[1]).to.be.an.instanceOf(FeatureLazyB);
    });

    it('should avoid definition if lazy is already defined', async () => {
      class FeatureLazyA extends FeatureA {}
      const tag = defineCE(
        class extends ScopedElementsMixin(LitElement) {
          render() {
            return html` <feature-lazy-a></feature-lazy-a> `;
          }
        },
      );

      const el = await fixture(`<${tag}></${tag}>`);

      expect(el.shadowRoot.children[0]).to.not.be.an.instanceOf(FeatureLazyA);

      el.defineScopedElement('feature-lazy-a', FeatureLazyA);

      expect(el.shadowRoot.children[0]).to.be.an.instanceOf(FeatureLazyA);

      el.defineScopedElement('feature-lazy-a', FeatureLazyA);
    });

    it("support define a lazy element even if it's not used in previous templates", async () => {
      class LazyElement extends LitElement {
        render() {
          return html` <div>Lazy element</div> `;
        }
      }

      const tag = defineCE(
        class extends ScopedElementsMixin(LitElement) {
          static get scopedElements() {
            return {
              'feature-a': FeatureA,
            };
          }

          connectedCallback() {
            if (super.connectedCallback) {
              super.connectedCallback();
            }

            this.defineScopedElement('lazy-element', LazyElement);

            this.loading = new Promise(resolve => {
              resolve(html` <lazy-element></lazy-element> `);
            });
          }

          render() {
            return html`
              <feature-a></feature-a>
              ${until(this.loading, html` <div>Loading...</div> `)}
            `;
          }
        },
      );

      const el = await fixture(`<${tag}></${tag}>`);

      await waitUntil(() => el.shadowRoot.children[1] instanceof LazyElement);
    });

    it.skip('should use by default a registry per class instead of per instance', async () => {
      class LazyElementA extends LitElement {
        render() {
          return html` <div>Lazy element A</div> `;
        }
      }

      const tag = defineCE(
        class extends ScopedElementsMixin(LitElement) {
          static get scopedElements() {
            return {
              'feature-a': FeatureA,
            };
          }

          connectedCallback() {
            if (super.connectedCallback) {
              super.connectedCallback();
            }

            this.loading = new Promise(resolve => {
              resolve(html` <lazy-element></lazy-element> `);
            });
          }

          render() {
            return html`
              <feature-a></feature-a>
              ${until(this.loading, html` <div>Loading...</div> `)}
            `;
          }
        },
      );

      const $el1 = await fixture(`<${tag}></${tag}>`);
      const $el2 = await fixture(`<${tag}></${tag}>`);

      $el1.defineScopedElement('lazy-element', LazyElementA);

      await waitUntil(() => $el1.shadowRoot.children[1] instanceof LazyElementA);
      await waitUntil(() => $el2.shadowRoot.children[1] instanceof LazyElementA);
    });

    it('should reuse the global tag if defined with the same name and class reference', async () => {
      class ItemA extends LitElement {
        render() {
          return html` <div>Item A</div> `;
        }
      }

      customElements.define('item-a', ItemA);

      const tag = defineCE(
        class ContainerElement extends ScopedElementsMixin(LitElement) {
          static get scopedElements() {
            return {
              ...super.scopedElements,
              'item-a': customElements.get('item-a'),
            };
          }

          render() {
            return html` <item-a></item-a> `;
          }
        },
      );

      const el = await fixture(`<${tag}></${tag}>`);
      const firstElement = el.shadowRoot.children[0];

      expect(firstElement.tagName.toLowerCase()).to.be.equal('item-a');
      expect(firstElement).to.be.instanceof(ItemA);
    });

    it('should adjust the `renderBefore` for shimmed adoptedStyleSheets', async () => {
      const tag = defineCE(
        class extends ScopedElementsMixin(LitElement) {
          static get styles() {
            return css`
              p {
                color: blue;
              }
            `;
          }

          render() {
            return html`
              <style>
                p {
                  color: red;
                }
              </style>
              <p>This should be blue!</p>
            `;
          }
        },
      );

      const el = await fixture(`<${tag}></${tag}>`);

      expect(
        getComputedStyle(el.shadowRoot.querySelector('p')).getPropertyValue('color'),
      ).to.be.equal('rgb(0, 0, 255)');
    });

    describe('directives integration', () => {
      it('should work with until(...)', async () => {
        const content = new Promise(resolve => {
          setTimeout(() => resolve(html` <feature-a id="feat"></feature-a> `), 0);
        });

        const tag = defineCE(
          class ContainerElement extends ScopedElementsMixin(LitElement) {
            static get scopedElements() {
              return {
                'feature-a': FeatureA,
              };
            }

            render() {
              return html` ${until(content, html` <span>Loading...</span> `)} `;
            }
          },
        );

        const el = await fixture(`<${tag}></${tag}>`);

        expect(el.shadowRoot.getElementById('feat')).to.be.null;

        await waitUntil(() => el.shadowRoot.getElementById('feat') !== null);
        const feature = el.shadowRoot.getElementById('feat');

        expect(feature).shadowDom.to.equal('<div>Element A</div>');
      });
    });

    describe('[deprecated] getScopedTagName', () => {
      it('should return the scoped tag name for a registered element', async () => {
        const tag = defineCE(
          class extends ScopedElementsMixin(LitElement) {
            static get scopedElements() {
              return {
                'feature-a': FeatureA,
              };
            }

            render() {
              return html`
                <feature-a></feature-a>
                <feature-b></feature-b>
              `;
            }
          },
        );

        const el = await fixture(`<${tag}></${tag}>`);

        expect(el.getScopedTagName('feature-a')).to.equal('feature-a');
        expect(el.getScopedTagName('feature-b')).to.equal('feature-b');
        expect(el.constructor.getScopedTagName('feature-a')).to.equal('feature-a');
        expect(el.constructor.getScopedTagName('feature-b')).to.equal('feature-b');
      });

      it('should return the scoped tag name for a non already registered element', async () => {
        class UnregisteredFeature extends LitElement {
          render() {
            return html` <div>Unregistered feature</div> `;
          }
        }

        const tag = defineCE(
          class extends ScopedElementsMixin(LitElement) {
            static get scopedElements() {
              return {
                'unregistered-feature': UnregisteredFeature,
              };
            }
          },
        );

        const el = await fixture(`<${tag}></${tag}>`);

        expect(el.getScopedTagName('unregistered-feature')).to.equal('unregistered-feature');
      });
    });
  });
}
