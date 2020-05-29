import { fixture, defineCE } from '@open-wc/testing-helpers';
import { assert, expect } from './bdd-setup.js';

describe('dom', () => {
  it('can compare dom nodes', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).dom.to.equal('<div><h1>Hey</h1></div>');
    expect(el).dom.to.not.equal('<div><h2>Hey</h2></div>');
    assert.dom.equal(el, '<div><h1>Hey</h1></div>');
    assert.dom.notEqual(el, '<div><h2>Hey</h2></div>');
  });

  it('passes along provided configuration', async () => {
    const el = await fixture('<div foo="bar"></div>');
    expect(el).dom.to.equal('<div></div>', { ignoreAttributes: ['foo'] });
    assert.dom.equal(el, '<div></div>', { ignoreAttributes: ['foo'] });
  });
});

describe('lightDom', () => {
  it('can compare lightDom nodes', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).lightDom.to.equal('<h1>Hey</h1>');
    expect(el).lightDom.to.not.equal('<h2>Hey</h2>');
    assert.lightDom.equal(el, '<h1>Hey</h1>');
    assert.lightDom.notEqual(el, '<h2>Hey</h2>');
  });

  it('passes along provided configuration', async () => {
    const el = await fixture('<div><p foo="bar">foo</p></div>');
    expect(el).lightDom.to.equal('<p>foo</p>', { ignoreAttributes: ['foo'] });
    assert.lightDom.equal(el, '<p>foo</p>', { ignoreAttributes: ['foo'] });
  });

  it('allows custom assertion message', async () => {
    const el = await fixture('<div><p foo="bar">foo</p></div>');
    try {
      expect(el).lightDom.to.equal('<p>foo</p>', 'should ignore foo attr');
      expect.fail('did not fail');
    } catch (error) {
      expect(error.message).to.equal(
        `should ignore foo attr: expected '<p foo="bar">\\n  foo\\n</p>\\n' to equal '<p>\\n  foo\\n</p>\\n'`,
      );
    }
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
    assert.dom.equal(el, `<${tag}><span>light content</span></${tag}>`);

    assert.shadowDom.equal(el, '<p>shadow content</p><slot>');
    assert.shadowDom.notEqual(el, '<span>shadow content</span><slot>');
    expect(el).shadowDom.to.equal('<p>shadow content</p><slot>');
    expect(el).shadowDom.to.not.equal('<span>shadow content</span><slot>');
  });
  it('additionally accepts document fragment nodes', async () => {
    const tag = defineCE(
      class extends HTMLElement {
        constructor() {
          super();
          this.nonstandardMount = document.createElement('span');
          document.body.appendChild(this.nonstandardMount);
          this.nonstandardMount.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
          this.nonstandardMount.shadowRoot.innerHTML =
            '<p>  shadow content</p> <!-- comment --> <slot></slot>';
        }

        disconnectedCallback() {
          this.nonstandardMount.parentElement.removeChild(this.nonstandardMount);
        }
      },
    );
    const el = await fixture(`<${tag}><span>  light content  </span></${tag}>`);

    assert.shadowDom.equal(el.nonstandardMount, '<p>shadow content</p><slot>');
    assert.shadowDom.notEqual(el.nonstandardMount, '<span>shadow content</span><slot>');
    expect(el.nonstandardMount).shadowDom.to.equal('<p>shadow content</p><slot>');
    expect(el.nonstandardMount).shadowDom.to.not.equal('<span>shadow content</span><slot>');
  });
});
