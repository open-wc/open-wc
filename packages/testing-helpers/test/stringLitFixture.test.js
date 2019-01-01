import { expect } from '@bundled-es-modules/chai';
import { html, stringFixture, stringFixtureSync, litFixture, litFixtureSync } from '../index.js';

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
      expect(element.parentNode.parentNode).to.equal(document.body);
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
      expect(element.parentNode.parentNode).to.equal(document.body);
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
});
