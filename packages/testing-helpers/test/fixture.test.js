import { expect } from '@bundled-es-modules/chai';
import { cachedWrappers } from '../fixtureWrapper.js';
import { html, fixture, fixtureSync } from '../index.js';

describe('fixtureSync & fixture', () => {
  it('supports strings', async () => {
    /**
     * @param {Element} element
     */
    function testElement(element) {
      expect(element.getAttribute('foo')).to.equal('bar');
    }

    const elementSync = fixtureSync(html`
      <div foo="${'bar'}"></div>
    `);
    testElement(elementSync);

    const elementAsync = await fixture(html`
      <div foo="${'bar'}"></div>
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
      <div .propNumber=${10} .propFunction=${myFunction}></div>
    `);
    testElement(elementSync);

    const elementAsync = await fixture(html`
      <div .propNumber=${10} .propFunction=${myFunction}></div>
    `);
    testElement(elementAsync);
  });

  it('will cleanup after each test', async () => {
    expect(cachedWrappers.length).to.equal(0);
  });
});
