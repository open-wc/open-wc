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
});
