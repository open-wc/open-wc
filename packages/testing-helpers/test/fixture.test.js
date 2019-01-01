import { expect } from '@bundled-es-modules/chai';
import { html, fixture, fixtureSync } from '../index.js';

class TestComponent2 extends HTMLElement {}
customElements.define('test-component2', TestComponent2);

describe('fixtureSync & fixture', () => {
  it('supports strings', async () => {
    /**
     * @param {Element} element
     */
    function testElement(element) {
      expect(element.getAttribute('foo')).to.equal('bar');
    }

    const elementSync = fixtureSync(html`
      <test-component2 foo="${'bar'}"></test-component2>
    `);
    testElement(elementSync);

    const elementAsync = await fixture(html`
      <test-component2 foo="${'bar'}"></test-component2>
    `);
    testElement(elementAsync);
  });

  it('supports lit-html TemplateResult with properties', async () => {
    const myFunction = () => {};

    /**
     * @param {Element} element
     */
    function testElement(element) {
      expect(element.propNumber).to.equal(10);
      expect(element.propFunction).to.equal(myFunction);
    }

    const elementSync = fixtureSync(html`
      <test-component2 .propNumber=${10} .propFunction=${myFunction}></test-component2>
    `);
    testElement(elementSync);

    const elementAsync = await fixture(html`
      <test-component2 .propNumber=${10} .propFunction=${myFunction}></test-component2>
    `);
    testElement(elementAsync);
  });
});
