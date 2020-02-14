import { expect } from '@open-wc/testing';
import { render } from 'lit-html';
import { createScopedHtml, createScope } from '../src/scoped-html.js';
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

describe('createScope', () => {
  describe('html', () => {
    it('passes strings and values as tagged templates expect', () => {
      class Kamino extends HTMLElement {}
      class AhchTo extends HTMLElement {}

      const $div = document.createElement('div');
      const data = 'text sample';
      const { html } = createScope({
        'kamino-planet': Kamino,
        'ahch-to-planet': AhchTo,
      });
      const template = html`
        <kamino-planet>${data}</kamino-planet><ahch-to-planet>${data}</ahch-to-planet>
      `;

      render(template, $div);

      expect($div.innerHTML).to.be.equal(
        '<!---->\n        ' +
          `<kamino-planet-${SUFFIX}><!---->text sample<!----></kamino-planet-${SUFFIX}>` +
          `<ahch-to-planet-${SUFFIX}><!---->text sample<!----></ahch-to-planet-${SUFFIX}>` +
          '\n      <!---->',
      );
    });

    it('defers the definition of components until they are used', () => {
      class Anoat extends HTMLElement {}
      class Christophsis extends HTMLElement {}

      const { html } = createScope({
        'anoat-planet': Anoat,
        'christophsis-planet': Christophsis,
      });

      html`
        <christophsis-planet></christophsis-planet>
      `;

      expect(customElements.get(`anoat-planet-${SUFFIX}`)).to.be.undefined;
      expect(customElements.get(`christophsis-planet-${SUFFIX}`)).to.not.be.undefined;
    });
  });

  describe('createElement', () => {
    class CatoNeimoidia extends HTMLElement {}

    const { createElement } = createScope({
      'cato-neimoidia-planet': CatoNeimoidia,
    });

    it('should be able to create a globally defined element', () => {
      const $div = createElement('div');

      expect($div).to.not.be.undefined;
      expect($div instanceof Element).to.be.true;
    });

    it('should be able to create an scoped element', () => {
      const $el = createElement('cato-neimoidia-planet');

      expect($el).to.not.be.undefined;
      expect($el instanceof CatoNeimoidia).to.be.true;
    });
  });
});
