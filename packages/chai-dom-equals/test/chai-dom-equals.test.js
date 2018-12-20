import './bdd-setup.js';
import { expect } from '@bundled-es-modules/chai';
import { fixture, defineCE } from '@open-wc/testing-helpers';
import { getOuterHtml, getCleanedShadowDom } from '../index.js';

describe('getOuterHtml', () => {
  it('support el.outerHTML also on polyfilled browsers', async () => {
    const el = await fixture('<div><p>content</p></div>');
    expect(getOuterHtml(el)).to.equals('<div><p>content</p></div>');
  });

  it('supports multiple attributes', async () => {
    const el = await fixture('<div id="foo" foo="bar"></div>');
    expect(getOuterHtml(el)).to.equals('<div id="foo" foo="bar"></div>');
  });

  it('supports shadow dom also on polyfilled browsers', async () => {
    const tag = defineCE(
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
          this.shadowRoot.innerHTML = '<p>shadow content</p><slot>';
        }
      },
    );
    // no line breaks here as it's a literal comparision e.g. line breaks are considered
    const el = await fixture(`<${tag}><span>light content</span></${tag}>`);
    expect(getOuterHtml(el)).to.equals(`<${tag}><span>light content</span></${tag}>`);

    const el2 = await fixture(`<${tag} foo="bar" foo2="bar2"><span>light content</span></${tag}>`);
    expect(getOuterHtml(el2)).to.equals(
      `<${tag} foo="bar" foo2="bar2"><span>light content</span></${tag}>`,
    );
  });

  it('supports nested shadow roots', async () => {
    const innerTag = defineCE(
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
          this.shadowRoot.innerHTML = '<p>inner shadow content</p><slot>';
        }
      },
    );
    const tag = defineCE(
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
          this.shadowRoot.innerHTML = '<p>shadow content</p><slot>';
        }
      },
    );

    // no line breaks here as it's a literal comparision e.g. line breaks are considered
    const el = await fixture(
      `<${tag}><${innerTag}><span>inner light content</span></${innerTag}><span> light content</span></${tag}>`,
    );
    expect(getOuterHtml(el)).to.equals(
      `<${tag}><${innerTag}><span>inner light content</span></${innerTag}><span> light content</span></${tag}>`,
    );

    const el2 = await fixture(
      `<${tag} foo="bar" foo2="bar2"><${innerTag}><span>inner light content</span></${innerTag}><span> light content</span></${tag}>`,
    );
    expect(getOuterHtml(el2)).to.equals(
      `<${tag} foo="bar" foo2="bar2"><${innerTag}><span>inner light content</span></${innerTag}><span> light content</span></${tag}>`,
    );
  });
});

describe('getCleanedShadowDom', () => {
  it('supports shadow dom also on polyfilled browsers', async () => {
    const tag = defineCE(
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
          this.shadowRoot.innerHTML = '<p>shadow content</p><slot></slot>';
        }
      },
    );
    // no line breaks here as it's a literal comparision e.g. line breaks are considered
    const el = await fixture(`<${tag}></${tag}>`);
    expect(getCleanedShadowDom(el)).to.equals('<p>shadow content</p><slot></slot>');
  });

  it('supports class attribute', async () => {
    const tag = defineCE(
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
          this.shadowRoot.innerHTML = '<p class="foo">shadow content</p><slot></slot>';
        }
      },
    );
    // no line breaks here as it's a literal comparision e.g. line breaks are considered
    const el = await fixture(`<${tag}></${tag}>`);
    expect(getCleanedShadowDom(el)).to.equals('<p class="foo">shadow content</p><slot></slot>');
  });

  it('supports nested shadow roots', async () => {
    const innerTag = defineCE(
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
          this.shadowRoot.innerHTML = '<p>inner shadow content</p><slot></slot>';
        }
      },
    );
    const tag = defineCE(
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
          this.shadowRoot.innerHTML = `<${innerTag} class="foo"></${innerTag}><p>shadow content</p><slot></slot>`;
        }
      },
    );

    // no line breaks here as it's a literal comparision e.g. line breaks are considered
    const el = await fixture(`<${tag}></${tag}>`);
    expect(getCleanedShadowDom(el)).to.equals(
      `<${innerTag} class="foo"></${innerTag}><p>shadow content</p><slot></slot>`,
    );
  });
});

describe('dom', () => {
  it('can strictly compare dom nodes', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).dom.to.equal('<div><!-- comment --><h1>Hey  </h1>  </div>');
  });

  it('can semmantically compare dom nodes', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).dom.to.semantically.equal('<div><h1>Hey</h1></div>');
  });
});

describe('shadowDom', () => {
  it('can strict compare shadow dom nodes', async () => {
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
    expect(el).dom.to.semantically.equal(`<${tag}><span>light content</span></${tag}>`);
    expect(el).shadowDom.to.equal('<p>  shadow content</p> <!-- comment --> <slot></slot>');
    expect(el).shadowDom.to.semantically.equal('<p>shadow content</p><slot>');
  });

  it('can semmantically compare shadow dom nodes', async () => {
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
    expect(el).dom.to.semantically.equal(`<${tag}><span>light content</span></${tag}>`);
    expect(el).shadowDom.to.semantically.equal('<p>shadow content</p><slot>');
  });
});
