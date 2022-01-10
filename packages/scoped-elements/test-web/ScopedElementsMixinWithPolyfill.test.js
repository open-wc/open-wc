import { expect, fixture, defineCE, waitUntil } from '@open-wc/testing';
import { LitElement, html } from 'lit';
import { until } from 'lit/directives/until.js';

import '@webcomponents/scoped-custom-element-registry';

import { ScopedElementsMixin } from '../index.js';
import { runScopedElementsMixinSuite } from './runScopedElementsMixinSuite.js';

runScopedElementsMixinSuite({
  label: 'ScopedElementsMixin features NOT needing a real scope [polyfill loaded]',
});

class FeatureA extends LitElement {
  render() {
    return html` <div>Element A</div> `;
  }
}

describe('ScopedElementsMixin features needing a real scope', () => {
  it('supports the "same" tag name in the template for multiple different sub components', async () => {
    class FeatureA1x extends LitElement {
      render() {
        return html` <div>Element A</div> `;
      }
    }

    class FeatureA2x extends LitElement {
      render() {
        return html` <div>Element A</div> `;
      }
    }

    class PageA extends ScopedElementsMixin(LitElement) {
      static get scopedElements() {
        return {
          'feature-a': FeatureA1x,
        };
      }

      render() {
        return html` <feature-a></feature-a> `;
      }
    }

    class PageB extends ScopedElementsMixin(LitElement) {
      static get scopedElements() {
        return {
          'feature-a': FeatureA2x,
        };
      }

      render() {
        return html` <feature-a></feature-a> `;
      }
    }

    const tag = defineCE(
      class extends ScopedElementsMixin(LitElement) {
        static get scopedElements() {
          return {
            'page-a': PageA,
            'page-b': PageB,
          };
        }

        render() {
          return html` <page-a></page-a><page-b></page-b> `;
        }
      },
    );
    const el = await fixture(`<${tag}></${tag}>`);
    expect(el.shadowRoot.children[0]).to.be.an.instanceOf(PageA);
    expect(el.shadowRoot.children[1]).to.be.an.instanceOf(PageB);

    const pageAFeatureANode = el.shadowRoot.children[0].shadowRoot.children[0];
    const pageBFeatureANode = el.shadowRoot.children[1].shadowRoot.children[0];

    expect(pageAFeatureANode.tagName.toLowerCase()).to.match(new RegExp(`feature-a`));
    expect(pageAFeatureANode).to.be.an.instanceOf(FeatureA1x);
    expect(pageBFeatureANode.tagName.toLowerCase()).to.match(new RegExp(`feature-a`));
    expect(pageBFeatureANode).to.be.an.instanceOf(FeatureA2x);
  });

  it('supports to use a shared template and use it with different sub components', async () => {
    const sharedTemplate = html` <feature-a></feature-a> `;

    class FeatureA1x extends LitElement {
      render() {
        return html` <div>Element A</div> `;
      }
    }

    class FeatureA2x extends LitElement {
      render() {
        return html` <div>Element A</div> `;
      }
    }

    class PageA extends ScopedElementsMixin(LitElement) {
      static get scopedElements() {
        return {
          'feature-a': FeatureA1x,
        };
      }

      render() {
        return sharedTemplate;
      }
    }

    class PageB extends ScopedElementsMixin(LitElement) {
      static get scopedElements() {
        return {
          'feature-a': FeatureA2x,
        };
      }

      render() {
        return sharedTemplate;
      }
    }

    const tag = defineCE(
      class extends ScopedElementsMixin(LitElement) {
        static get scopedElements() {
          return {
            'page-a': PageA,
            'page-b': PageB,
          };
        }

        render() {
          return html` <page-a></page-a><page-b></page-b> `;
        }
      },
    );
    const el = await fixture(`<${tag}></${tag}>`);
    expect(el.shadowRoot.children[0]).to.be.an.instanceOf(PageA);
    expect(el.shadowRoot.children[1]).to.be.an.instanceOf(PageB);

    const pageAFeatureANode = el.shadowRoot.children[0].shadowRoot.children[0];
    const pageBFeatureANode = el.shadowRoot.children[1].shadowRoot.children[0];

    expect(pageAFeatureANode.tagName.toLowerCase()).to.match(new RegExp(`feature-a`));
    expect(pageAFeatureANode).to.be.an.instanceOf(FeatureA1x);
    expect(pageBFeatureANode.tagName.toLowerCase()).to.match(new RegExp(`feature-a`));
    expect(pageBFeatureANode).to.be.an.instanceOf(FeatureA2x);
  });

  it('should be able to have a registry per instance instead of per class', async () => {
    class LazyElementA extends LitElement {
      render() {
        return html` <div>Lazy element A</div> `;
      }
    }

    class LazyElementB extends LitElement {
      render() {
        return html` <div>Lazy element B</div> `;
      }
    }

    const tag = defineCE(
      class extends ScopedElementsMixin(LitElement) {
        static get scopedElements() {
          return {
            'feature-a': FeatureA,
          };
        }

        get registry() {
          return this.__registry;
        }

        set registry(registry) {
          this.__registry = registry;
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
    $el2.defineScopedElement('lazy-element', LazyElementB);

    await waitUntil(() => $el1.shadowRoot.children[1] instanceof LazyElementA);
    await waitUntil(() => $el2.shadowRoot.children[1] instanceof LazyElementB);
  });

  it('should be able to share a registry between different classes', async () => {
    const registry = new CustomElementRegistry();

    registry.define('feature-a', FeatureA);

    class LazyElementA extends LitElement {
      render() {
        return html` <div>Lazy element A</div> `;
      }
    }

    const tagA = defineCE(
      class extends ScopedElementsMixin(LitElement) {
        get registry() {
          return registry;
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

    const tagB = defineCE(
      class extends ScopedElementsMixin(LitElement) {
        get registry() {
          return registry;
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

    const $el1 = await fixture(`<${tagA}></${tagA}>`);
    const $el2 = await fixture(`<${tagB}></${tagB}>`);

    $el1.defineScopedElement('lazy-element', LazyElementA);

    await waitUntil(() => $el1.shadowRoot.children[1] instanceof LazyElementA);
    await waitUntil(() => $el2.shadowRoot.children[1] instanceof LazyElementA);
  });
});
