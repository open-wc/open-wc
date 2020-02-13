import { expect } from '@open-wc/testing';
import { render } from 'lit-html';
import { createScopedHtml } from '../src/scoped-html.js';
import { SUFFIX } from '../src/tag.js';

describe('createScopedHtml', () => {
  it('passes strings and values as tagged templates expect', () => {
    class Onderon extends HTMLElement {}
    class Ossus extends HTMLElement {}

    const $div = document.createElement('div');
    const data = 'text sample';
    const html = createScopedHtml({
      'onderon-planet': Onderon,
      'ossus-planet': Ossus,
    });
    const template = html`
      <onderon-planet>${data}</onderon-planet><ossus-planet>${data}</ossus-planet>
    `;

    render(template, $div);

    expect($div.innerHTML).to.be.equal(
      '<!---->\n      ' +
        `<onderon-planet-${SUFFIX}><!---->text sample<!----></onderon-planet-${SUFFIX}>` +
        `<ossus-planet-${SUFFIX}><!---->text sample<!----></ossus-planet-${SUFFIX}>` +
        '\n    <!---->',
    );
  });

  it('defers the definition of components until they are used', () => {
    class Ithor extends HTMLElement {}
    class Taris extends HTMLElement {}

    const html = createScopedHtml({
      'ithor-planet': Ithor,
      'taris-planet': Taris,
    });

    html`
      <taris-planet></taris-planet>
    `;

    expect(customElements.get(`ithor-planet-${SUFFIX}`)).to.be.undefined;
    expect(customElements.get(`taris-planet-${SUFFIX}`)).to.not.be.undefined;
  });
});
