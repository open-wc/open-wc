// @ts-ignore
import sinon from 'sinon';
// @ts-ignore
import { expect } from '@bundled-es-modules/chai';
import { cachedWrappers } from '../fixtureWrapper.js';
import { defineCE } from '../helpers';
import { html, fixture, fixtureSync } from '../index.js';
import { unsafeStatic } from '../lit-html.js';

describe('fixtureSync & fixture', () => {
  it('supports strings', async () => {
    const elSync = fixtureSync(`<div foo="${'bar'}"></div>`);
    expect(elSync.getAttribute('foo')).to.equal('bar');

    const elAsync = await fixture(`<div foo="${'bar'}"></div>`);
    expect(elAsync.getAttribute('foo')).to.equal('bar');
  });

  it('supports lit-html TemplateResult with properties', async () => {
    const myFunction = () => {};

    /**
     * @typedef {Object} TestDiv
     * @property {number} propNumber Test property for number
     * @property {function} propFunction Test property for function
     *
     * @param {TestDiv} element
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

  it('waits for updateComplete', async () => {
    let counter = 0;

    class Test extends HTMLElement {
      constructor() {
        super();
        this.updateComplete = new Promise(resolve => {
          this.resolve = resolve;
        }).then(() => {
          counter += 1;
        });
      }

      connectedCallback() {
        this.resolve();
      }
    }

    const tag = defineCE(Test);
    await fixture(`<${tag}></${tag}>`);
    expect(counter).to.equal(1);

    const litTag = unsafeStatic(tag);
    await fixture(html`<${litTag}></${litTag}>`);
    expect(counter).to.equal(2);
  });

  it('ensures ShadyDOM finished its job', async () => {
    // @ts-ignore
    const originalShadyDOM = window.ShadyDOM;

    // @ts-ignore
    window.ShadyDOM = { flush: sinon.spy() };

    class Test extends HTMLElement {}

    const tag = defineCE(Test);
    await fixture(`<${tag}></${tag}>`);
    // @ts-ignore
    expect(window.ShadyDOM.flush.callCount).to.equal(1);

    // @ts-ignore
    window.ShadyDOM = originalShadyDOM;
  });

  it('waits for componentOnReady', async () => {
    let counter = 0;

    class Test extends HTMLElement {
      constructor() {
        super();
        this.rendered = new Promise(resolve => {
          this.resolve = resolve;
        }).then(() => {
          counter += 1;
        });
      }

      connectedCallback() {
        this.resolve();
      }

      componentOnReady() {
        return this.rendered;
      }
    }

    const tag = defineCE(Test);
    await fixture(`<${tag}></${tag}>`);
    expect(counter).to.equal(1);

    const litTag = unsafeStatic(tag);
    await fixture(html`<${litTag}></${litTag}>`);
    expect(counter).to.equal(2);
  });
});
