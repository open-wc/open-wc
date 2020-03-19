import { expect, fixture, defineCE } from '@open-wc/testing';
import { LitElement, html } from 'lit-element';
import { ScopedElementsMixin } from '../index.js';
import { getFromGlobalTagsCache } from '../src/globalTagsCache.js';

class FeatureA extends LitElement {
  render() {
    return html`
      <div>Element A</div>
    `;
  }
}

class FeatureB extends LitElement {
  render() {
    return html`
      <div>Element A</div>
    `;
  }
}

describe('ScopedElementsMixin', () => {
  it('has a default value for "static get scopedElements()" of {}', async () => {
    const tag = defineCE(class extends ScopedElementsMixin(LitElement) {});
    const el = await fixture(`<${tag}></${tag}>`);
    // @ts-ignore
    expect(el.constructor.scopedElements).to.deep.equal({});
  });

  it('will not fail if there is no "static get scopedElements()"', async () => {
    const tag = defineCE(
      class ContainerElement extends ScopedElementsMixin(LitElement) {
        render() {
          return html`
            <feature-a></feature-a><feature-b></feature-b>
          `;
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
          return html`
            <feature-a></feature-a><feature-b></feature-b>
          `;
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
        return html`
          <div>Element A</div>
        `;
      }
    }

    class FeatureA2x extends LitElement {
      render() {
        return html`
          <div>Element A</div>
        `;
      }
    }

    class PageA extends ScopedElementsMixin(LitElement) {
      static get scopedElements() {
        return {
          'feature-a': FeatureA1x,
        };
      }

      render() {
        return html`
          <feature-a></feature-a>
        `;
      }
    }

    class PageB extends ScopedElementsMixin(LitElement) {
      static get scopedElements() {
        return {
          'feature-a': FeatureA2x,
        };
      }

      render() {
        return html`
          <feature-a></feature-a>
        `;
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
          return html`
            <page-a></page-a><page-b></page-b>
          `;
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
    const sharedTemplate = html`
      <feature-a></feature-a>
    `;

    class FeatureA1x extends LitElement {
      render() {
        return html`
          <div>Element A</div>
        `;
      }
    }

    class FeatureA2x extends LitElement {
      render() {
        return html`
          <div>Element A</div>
        `;
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
          return html`
            <page-a></page-a><page-b></page-b>
          `;
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
        return html`
          <div>Element C</div>
        `;
      }
    }

    class FeatureD extends LitElement {
      render() {
        return html`
          <div>Element D</div>
        `;
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
          return html`
            <feature-c></feature-c>
          `;
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

    // @ts-ignore
    el.defineScopedElement('feature-b', FeatureB);

    expect(el.shadowRoot.children[1]).to.be.an.instanceOf(FeatureB);
  });

  describe('getScopedTagName', () => {
    it('should return the scoped tag name', async () => {
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

      // @ts-ignore
      expect(el.constructor.getScopedTagName('feature-a')).to.match(tagRegExp);
      // @ts-ignore
      expect(el.constructor.getScopedTagName('feature-b')).to.match(tagRegExp);
    });
  });
});
