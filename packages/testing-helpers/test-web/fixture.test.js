// @ts-ignore
import sinon from 'sinon';
// @ts-ignore
import { html as litHtml, LitElement } from 'lit-element';
import { expect } from './setup.js';
import { cachedWrappers } from '../src/fixtureWrapper.js';
import { defineCE } from '../src/helpers.js';
import { fixture, fixtureSync } from '../src/fixture.js';
import { html, unsafeStatic } from '../src/lit-html.js';
import { NODE_TYPES } from '../src/lib.js';

import '../../testing/register-chai-plugins.js';

function createParent() {
  return document.createElement('my-parent');
}

describe('fixtureSync & fixture', () => {
  it('supports strings', async () => {
    const elSync = fixtureSync(`<div foo="${'bar'}"></div>`);
    expect(elSync.getAttribute('foo')).to.equal('bar');

    const elAsync = await fixture(`<div foo="${'bar'}"></div>`);
    expect(elAsync.getAttribute('foo')).to.equal('bar');
  });

  it('supports strings with custom parent', async () => {
    const elSync = fixtureSync(`<div foo="${'bar'}"></div>`, {
      parentNode: createParent(),
    });
    expect(elSync.parentElement.tagName).to.equal('MY-PARENT');

    const elAsync = await fixture(`<div foo="${'bar'}"></div>`, {
      parentNode: createParent(),
    });
    expect(elAsync.parentElement.tagName).to.equal('MY-PARENT');
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

    const elementAsync = await fixture(html`
      <div .propNumber=${10} .propFunction=${myFunction}></div>
    `);
    // @ts-ignore
    testElement(elementAsync);
  });

  it('supports lit-html TemplateResult with whitespace', async () => {
    /**
     * @param {Element} element
     */
    function testElement(element) {
      expect(element.localName).to.equal('div');
    }

    const elementSync = fixtureSync(html` <div></div> `);
    // @ts-ignore
    testElement(elementSync);

    const elementAsync = await fixture(html` <div></div> `);
    // @ts-ignore
    testElement(elementAsync);
  });

  it('supports lit-html TemplateResult with custom parent', async () => {
    const elSync = fixtureSync(html` <div foo="${'bar'}"></div> `, {
      parentNode: createParent(),
    });
    expect(elSync.parentElement.tagName).to.equal('MY-PARENT');

    const elAsync = await fixture(html` <div foo="${'bar'}"></div> `, {
      parentNode: createParent(),
    });
    expect(elAsync.parentElement.tagName).to.equal('MY-PARENT');
  });

  describe('Node', () => {
    it('supports Text Node', async () => {
      /**
       * @param {Node} node
       */
      function doTest(node) {
        expect(node.textContent).to.equal('test');
        expect(node.nodeType).to.equal(NODE_TYPES.TEXT_NODE);
      }

      const textNode = document.createTextNode('test');

      const textNodeSync = fixtureSync(textNode);
      doTest(textNodeSync);

      const textNodeAsync = await fixture(textNode);
      doTest(textNodeAsync);
    });

    it('supports Text Node Array', async () => {
      /**
       * @param {Node} node
       */
      function doTest(node) {
        expect(node.textContent).to.equal('test');
        expect(node.nodeType).to.equal(NODE_TYPES.TEXT_NODE);
      }

      const textNodeArray = [
        document.createTextNode('test'),
        document.createTextNode('silently ignored'),
      ];

      const textNodeSync = fixtureSync(textNodeArray);
      doTest(textNodeSync);

      const textNodeAsync = await fixture(textNodeArray);
      doTest(textNodeAsync);
    });

    it('supports Element Node', async () => {
      /**
       * @param {Node} node
       */
      function doTest(node) {
        expect(node.textContent).to.equal('test');
        expect(node.nodeType).to.equal(NODE_TYPES.ELEMENT_NODE);
      }

      const elementNode = document.createElement('div');
      elementNode.innerHTML = 'test';

      const textNodeSync = fixtureSync(elementNode);
      doTest(textNodeSync);

      const textNodeAsync = await fixture(elementNode);
      doTest(textNodeAsync);
    });

    it('supports Element Node Array', async () => {
      /**
       * @param {Node} node
       */
      function doTest(node) {
        expect(node.textContent).to.equal('test');
        expect(node.nodeType).to.equal(NODE_TYPES.ELEMENT_NODE);
      }

      const elementNodeArray = [document.createElement('div'), document.createElement('div')];

      elementNodeArray[0].innerHTML = 'test';
      elementNodeArray[1].innerHTML = 'silently ignored';

      const textNodeSync = fixtureSync(elementNodeArray);
      doTest(textNodeSync);

      const textNodeAsync = await fixture(elementNodeArray);
      doTest(textNodeAsync);
    });

    it('supports DOM tree', async () => {
      /**
       * @param {Node} node
       */
      function doTest(node) {
        expect(node.textContent).to.equal('test the tree');
        expect(node.nodeType).to.equal(NODE_TYPES.ELEMENT_NODE);
      }

      const parent = document.createElement('div');
      const child = document.createElement('div');
      const grandchild = document.createElement('div');

      grandchild.appendChild(document.createTextNode('tree'));
      child.appendChild(document.createTextNode('the '));
      parent.appendChild(document.createTextNode('test '));

      child.appendChild(grandchild);
      parent.appendChild(child);

      /*
        <div>
          test
          <div>
            the
            <div>
              tree
            </div>
          </div>
        </div>
       */

      const textNodeSync = fixtureSync(parent);
      doTest(textNodeSync);

      const textNodeAsync = await fixture(parent);
      doTest(textNodeAsync);
    });
  });

  describe('primitives', () => {
    it('supports number', async () => {
      /**
       * @param {Node} node
       */
      function doTest(node) {
        expect(node.textContent).to.equal('1');
        expect(node.nodeType).to.equal(NODE_TYPES.TEXT_NODE);
      }

      const textNodeSync = fixtureSync(1);
      doTest(textNodeSync);

      const textNodeAsync = await fixture(1);
      doTest(textNodeAsync);
    });

    it('supports number array', async () => {
      /**
       * @param {Node} node
       */
      function doTest(node) {
        expect(node.textContent).to.equal('0');
        expect(node.nodeType).to.equal(NODE_TYPES.TEXT_NODE);
      }

      // NB: the 1 is silently ignored
      const numberArray = [0, 1];

      const numberArraySync = fixtureSync(numberArray);
      doTest(numberArraySync);

      const numberArrayAsync = await fixture(numberArray);
      doTest(numberArrayAsync);
    });

    it('supports boolean', async () => {
      /**
       * @param {Node} node
       */
      function doTest(node) {
        expect(node.textContent).to.equal('true');
        expect(node.nodeType).to.equal(NODE_TYPES.TEXT_NODE);
      }

      const textNodeSync = fixtureSync(true);
      doTest(textNodeSync);

      const textNodeAsync = await fixture(true);
      doTest(textNodeAsync);
    });

    it('supports boolean array', async () => {
      /**
       * @param {Node} node
       */
      function doTest(node) {
        expect(node.textContent).to.equal('true');
        expect(node.nodeType).to.equal(NODE_TYPES.TEXT_NODE);
      }

      // NB: the `false` is silently ignored
      const booleanArray = [true, false];

      const booleanArraySync = fixtureSync(booleanArray);
      doTest(booleanArraySync);

      const booleanArrayAsync = await fixture(booleanArray);
      doTest(booleanArrayAsync);
    });
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

  it('supports scoped-elements', async () => {
    class TestClass extends LitElement {
      static get properties() {
        return {
          foo: { type: String },
        };
      }

      constructor() {
        super();

        this.foo = '';
      }

      render() {
        return litHtml`
          <div>${this.foo}</div>
        `;
      }
    }

    const elString = await fixture('<test-class foo="bar"></test-class>', {
      scopedElements: {
        'test-class': TestClass,
      },
    });

    expect(elString.shadowRoot.innerHTML).to.include('bar');

    const elLit = await fixture(html` <test-class foo="bar"></test-class> `, {
      scopedElements: {
        'test-class': TestClass,
      },
    });

    expect(elLit.shadowRoot.innerHTML).to.include('bar');
  });
});
