import { expect } from '@bundled-es-modules/chai';
import { stringFixture, stringFixtureSync } from '../src/stringFixture.js';
import { litFixture, litFixtureSync } from '../src/litFixture.js';
import { defineCE, nextFrame } from '../src/helpers.js';
import { html, unsafeStatic } from '../src/lit-html.js';
import { cleanupFixture } from '../src/fixture-manager.js';

class TestComponent extends HTMLElement {}
customElements.define('test-component', TestComponent);

describe('stringFixtureSync & litFixtureSync & fixture & litFixture', () => {
  it('asynchronously returns an element node', async () => {
    /**
     * @param {Element} element
     */
    function testElement(element) {
      expect(element).to.be.an.instanceof(TestComponent);
      expect(element.textContent).to.equal('Text content');
      cleanupFixture(element);
    }
    [
      stringFixtureSync('<test-component>Text content</test-component>'),
      litFixtureSync(
        html`
          <test-component>Text content</test-component>
        `,
      ),
    ].forEach(testElement);
    (await Promise.all([
      stringFixture('<test-component>Text content</test-component>'),
      litFixture(
        html`
          <test-component>Text content</test-component>
        `,
      ),
    ])).forEach(testElement);
  });

  it('wraps element into a div attached to the body', async () => {
    /**
     * @param {Element} element
     */
    function testElement(element) {
      expect(element.parentNode).to.be.an.instanceof(HTMLDivElement);
      expect(element.parentNode.parentNode).to.be.an.instanceof(HTMLDivElement);
      expect(element.parentNode.parentNode.parentNode).to.equal(document.body);
      cleanupFixture(element);
    }
    [
      stringFixtureSync('<test-component></test-component>'),
      litFixtureSync(
        html`
          <test-component></test-component>
        `,
      ),
    ].forEach(testElement);
    (await Promise.all([
      stringFixture('<test-component></test-component>'),
      litFixture(
        html`
          <test-component></test-component>
        `,
      ),
    ])).forEach(testElement);
  });

  it('allows to create several fixtures in one test', async () => {
    /**
     * @param {Element} element
     */
    function testElement(element) {
      expect(element).to.be.an.instanceof(TestComponent);
      expect(element.parentNode).to.be.an.instanceof(HTMLDivElement);
      expect(element.parentNode.parentNode).to.be.an.instanceof(HTMLDivElement);
      expect(element.parentNode.parentNode.parentNode).to.equal(document.body);
      cleanupFixture(element);
    }
    [
      stringFixtureSync('<test-component></test-component>'),
      stringFixtureSync('<test-component></test-component>'),
      litFixtureSync(
        html`
          <test-component></test-component>
        `,
      ),
      litFixtureSync(
        html`
          <test-component></test-component>
        `,
      ),
    ].forEach(testElement);
    (await Promise.all([
      stringFixture('<test-component></test-component>'),
      stringFixture('<test-component></test-component>'),
      litFixture(
        html`
          <test-component></test-component>
        `,
      ),
      litFixture(
        html`
          <test-component></test-component>
        `,
      ),
    ])).forEach(testElement);
  });

  it('handles self closing tags', async () => {
    /**
     * @param {Element} element
     */
    function testElement(element) {
      expect(element).to.be.an.instanceof(TestComponent);
      cleanupFixture(element);
    }
    [
      stringFixtureSync('<test-component/>'),
      litFixtureSync(
        html`
          <test-component />
        `,
      ),
    ].forEach(testElement);
    (await Promise.all([
      stringFixture('<test-component/>'),
      litFixture(
        html`
          <test-component />
        `,
      ),
    ])).forEach(testElement);
  });

  it('always returns first child element ignoring whitespace and other elements', async () => {
    /**
     * @param {Element} element
     */
    function testElement(element) {
      expect(element).to.be.an.instanceof(TestComponent);
      cleanupFixture(element);
    }
    [
      stringFixtureSync(`
        <test-component></test-component>
        <div></div>
      `),
      litFixtureSync(html`
        <test-component></test-component>
        <div></div>
      `),
    ].forEach(testElement);
    (await Promise.all([
      stringFixture(`
        <test-component></test-component>
        <div></div>
      `),
      litFixture(html`
        <test-component></test-component>
        <div></div>
      `),
    ])).forEach(testElement);
  });

  it('will wait for one frame', async () => {
    let counter = 0;
    const tag = defineCE(class extends HTMLElement {});
    const litTag = unsafeStatic(tag);

    nextFrame().then(() => {
      counter += 1;
    });
    const elementA = await stringFixture(`<${tag}></${tag}>`);
    expect(counter).to.equal(1);

    nextFrame().then(() => {
      counter += 1;
    });
    const elementB = await litFixture(html`<${litTag}></${litTag}>`);
    expect(counter).to.equal(2);

    cleanupFixture(elementA);
    cleanupFixture(elementB);
  });

  it('will wait for an updateComplete promise if it is available', async () => {
    let counter = 0;
    const tag = defineCE(
      class extends HTMLElement {
        get updateComplete() {
          return new Promise(resolve => requestAnimationFrame(resolve)).then(() => {
            counter += 1;
          });
        }
      },
    );
    const litTag = unsafeStatic(tag);

    const elementA = await stringFixture(`<${tag}></${tag}>`);
    expect(counter).to.equal(1);
    const elementB = await litFixture(html`<${litTag}></${litTag}>`);
    expect(counter).to.equal(2);

    cleanupFixture(elementA);
    cleanupFixture(elementB);
  });
});
