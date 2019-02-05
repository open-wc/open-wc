import { expect } from '@bundled-es-modules/chai';
import { assert, spy } from 'sinon';
import { cachedWrappers } from '../fixtureWrapper.js';
import { defineCE } from '../helpers';
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

  it('waits for updateComplete', async () => {
    const connectedCallbackSpy = spy();

    class Test extends HTMLElement {
      constructor() {
        super();
        this.updateComplete = new Promise(resolve => {
          this.resolve = resolve();
        });
      }

      connectedCallback() {
        this.resolve();
        connectedCallbackSpy();
      }
    }

    const tag = defineCE(Test);

    await fixture(html`
      <${tag}></${tag}>
    `);

    assert.calledOnce(connectedCallbackSpy);
  });

  it('waits for componentOnReady', async () => {
    const connectedCallbackSpy = spy();

    class Test extends HTMLElement {
      constructor() {
        super();
        this.rendered = new Promise(resolve => {
          this.resolve = resolve();
        });
      }

      connectedCallback() {
        this.resolve();
        connectedCallbackSpy();
      }

      componentOnReady() {
        return this.rendered;
      }
    }

    const tag = defineCE(Test);

    await fixture(html`
      <${tag}></${tag}>
    `);

    assert.calledOnce(connectedCallbackSpy);
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
