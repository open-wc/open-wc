// @ts-nocheck
import { expect, fixture, defineCE, waitUntil } from '@open-wc/testing';
import { LitElement, html } from 'lit-element';
import { until } from 'lit-html/directives/until.js';
import { repeat } from 'lit-html/directives/repeat';
import { ScopedElementsMixin } from '../index.js';
import { getFromGlobalTagsCache } from '../src/globalTagsCache.js';

class FeatureA extends LitElement {
  render() {
    return html` <div>Element A</div> `;
  }
}

class FeatureB extends LitElement {
  render() {
    return html` <div>Element A</div> `;
  }
}

describe('ScopedElementsMixin', () => {
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

    expect(pageAFeatureANode.tagName.toLowerCase()).to.match(new RegExp(`feature-a-\\d{1,5}`));
    expect(pageAFeatureANode).to.be.an.instanceOf(FeatureA1x);
    expect(pageBFeatureANode.tagName.toLowerCase()).to.match(new RegExp(`feature-a-\\d{1,5}`));
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

    expect(pageAFeatureANode.tagName.toLowerCase()).to.match(new RegExp(`feature-a-\\d{1,5}`));
    expect(pageAFeatureANode).to.be.an.instanceOf(FeatureA1x);
    expect(pageBFeatureANode.tagName.toLowerCase()).to.match(new RegExp(`feature-a-\\d{1,5}`));
    expect(pageBFeatureANode).to.be.an.instanceOf(FeatureA2x);
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
    expect(getFromGlobalTagsCache(FeatureD)).to.be.undefined;
  });

  it('supports lazy loaded elements', async () => {
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
            <feature-c></feature-c>
          `;
        }
      },
    );

    const el = await fixture(`<${tag}></${tag}>`);

    expect(el.shadowRoot.children[0]).to.be.an.instanceOf(FeatureA);
    expect(el.shadowRoot.children[1]).to.not.be.an.instanceOf(FeatureB);
    expect(el.shadowRoot.children[2]).to.not.undefined;

    el.defineScopedElement('feature-b', FeatureB);

    expect(el.shadowRoot.children[1]).to.be.an.instanceOf(FeatureB);
  });

  it('should avoid definition if lazy is already defined', async () => {
    const tag = defineCE(
      class extends ScopedElementsMixin(LitElement) {
        render() {
          return html` <feature-a></feature-a> `;
        }
      },
    );

    const el = await fixture(`<${tag}></${tag}>`);

    expect(el.shadowRoot.children[0]).to.not.be.an.instanceOf(FeatureA);

    el.defineScopedElement('feature-a', FeatureA);

    expect(el.shadowRoot.children[0]).to.be.an.instanceOf(FeatureA);

    el.defineScopedElement('feature-a', FeatureA);
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

  it('define a lazy elements per instance instead of per class', async () => {
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

  describe('getScopedTagName', () => {
    it('should return the scoped tag name for a registered element', async () => {
      const chars = `-|\\.|[0-9]|[a-z]`;
      const tagRegExp = new RegExp(`[a-z](${chars})*-(${chars})*-[0-9]{1,5}`);

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

      expect(el.getScopedTagName('feature-a')).to.match(tagRegExp);
      expect(el.getScopedTagName('feature-b')).to.match(tagRegExp);
    });

    it('should return the scoped tag name for a non already registered element', async () => {
      const chars = `-|\\.|[0-9]|[a-z]`;
      const tagRegExp = new RegExp(`[a-z](${chars})*-(${chars})*-[0-9]{1,5}`);

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

      expect(el.getScopedTagName('unregistered-feature')).to.match(tagRegExp);
    });
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

    it('should work with repeat(...)', async () => {
      const tag = defineCE(
        class ContainerElement extends ScopedElementsMixin(LitElement) {
          static get scopedElements() {
            return {
              'feature-a': FeatureA,
            };
          }

          render() {
            return html`
              ${repeat(
                [...Array(10).keys()],
                () => html` <feature-a data-type="child"></feature-a> `,
              )}
            `;
          }
        },
      );

      const el = await fixture(`<${tag}></${tag}>`);

      el.shadowRoot.querySelectorAll('[data-type="child"]').forEach(child => {
        expect(child).shadowDom.to.equal('<div>Element A</div>');
      });
    });
  });
});
