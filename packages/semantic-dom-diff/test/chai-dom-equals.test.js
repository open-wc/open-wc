import { expect } from '@bundled-es-modules/chai';
import './bdd-setup.js';
import { fixture, defineCE } from '@open-wc/testing-helpers';

describe('dom', () => {
  it('can compare dom nodes', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).dom.to.equal('<div><h1>Hey</h1></div>');
  });

  it('passes along provided configuration', async () => {
    const el = await fixture('<div foo="bar"></div>');
    expect(el).dom.to.equal('<div></div>', { ignoreAttributes: ['foo'] });
  });
});

describe('lightDom', () => {
  it('can compare lightDom nodes', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).lightDom.to.equal('<h1>Hey</h1>');
  });

  it('passes along provided configuration', async () => {
    const el = await fixture('<div><p foo="bar">foo</p></div>');
    expect(el).lightDom.to.equal('<p>foo</p>', { ignoreAttributes: ['foo'] });
  });
});

describe('shadowDom', () => {
  it('can compare shadow dom nodes', async () => {
    const tag = defineCE(
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
          this.shadowRoot.innerHTML = '<p>  shadow content</p> <!-- comment --> <slot></slot>';
        }
      },
    );
    const el = await fixture(`<${tag}><span>  light content  </span></${tag}>`);
    expect(el).dom.to.equal(`<${tag}><span>light content</span></${tag}>`);
    expect(el).shadowDom.to.equal('<p>shadow content</p><slot>');
  });
});
