// @ts-ignore
import sinon from 'sinon';
// @ts-ignore
import { expect } from '@bundled-es-modules/chai';
import { cleanupFixture } from '../src/fixture-manager.js';
import { defineCE } from '../src/helpers.js';
import { fixture, fixtureSync } from '../src/fixture.js';
import { html, unsafeStatic } from '../src/lit-html.js';

describe('fixtureSync & fixture', () => {
  it('supports strings', async () => {
    const elSync = fixtureSync(`<div foo="${'bar'}"></div>`);
    expect(elSync.getAttribute('foo')).to.equal('bar');

    const elAsync = await fixture(`<div foo="${'bar'}"></div>`);
    expect(elAsync.getAttribute('foo')).to.equal('bar');

    cleanupFixture(elSync);
    cleanupFixture(elAsync);
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
    // @ts-ignore
    testElement(elementSync);

    const element1sync = await fixture(html`
      <div .propNumber=${10} .propFunction=${myFunction}></div>
    `);
    // @ts-ignore
    testElement(element1sync);

    cleanupFixture(elementSync);
    cleanupFixture(element1sync);
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
    const el = await fixture(`<${tag}></${tag}>`);
    expect(counter).to.equal(1);

    const litTag = unsafeStatic(tag);
    const litEl = await fixture(html`<${litTag}></${litTag}>`);
    expect(counter).to.equal(2);

    cleanupFixture(el);
    cleanupFixture(litEl);
  });

  it('ensures ShadyDOM finished its job', async () => {
    // @ts-ignore
    const originalShadyDOM = window.ShadyDOM;

    // @ts-ignore
    window.ShadyDOM = { flush: sinon.spy() };

    class Test extends HTMLElement {}

    const tag = defineCE(Test);
    const el = await fixture(`<${tag}></${tag}>`);
    // @ts-ignore
    expect(window.ShadyDOM.flush.callCount).to.equal(1);

    // @ts-ignore
    window.ShadyDOM = originalShadyDOM;

    cleanupFixture(el);
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
    const el = await fixture(`<${tag}></${tag}>`);
    expect(counter).to.equal(1);

    const litTag = unsafeStatic(tag);
    const litEl = await fixture(html`<${litTag}></${litTag}>`);
    expect(counter).to.equal(2);

    cleanupFixture(el);
    cleanupFixture(litEl);
  });
});
