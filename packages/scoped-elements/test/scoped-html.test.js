import { expect } from '@open-wc/testing';
import { render } from 'lit-html';
import { createScopedHtml } from '../src/scoped-html.js';

describe('wrap', () => {
  it('passes strings and values as tagged templates expect', () => {
    class Onderon extends HTMLElement {
    }
    class Ossus extends HTMLElement {
    }

    const $div = document.createElement('div');
    const data = 'text sample';
    const html = createScopedHtml({
      'onderon-planet': Onderon,
      'ossus-planet': Ossus,
    });
    const template = html`<onderon-planet>${data}</onderon-planet><ossus-planet>${data}</ossus-planet>`;

    render(template, $div);

    expect($div.innerHTML).to.be.equal(
        '<!---->' +
        '<c-onderon><!---->text sample<!----></c-onderon>' +
        '<c-ossus><!---->text sample<!----></c-ossus>' +
        '<!---->'
    );
  });
});
