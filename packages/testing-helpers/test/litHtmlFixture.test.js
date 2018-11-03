import {
  html,
  htmlFixture,
  htmlFixtureSync,
  litHtmlFixture,
  litHtmlFixtureSync,
} from '../index.js';

class TestComponent extends HTMLElement {}
customElements.define('test-component', TestComponent);

describe('htmlFixtureSync & litHtmlFixtureSync & htmlFixture & litHtmlFixture', () => {
  it('asynchronously returns an element node', async () => {
    function testElement(element) {
      expect(element).to.be.an.instanceof(TestComponent);
      expect(element.textContent).to.equal('Text content');
    }
    [
      htmlFixtureSync('<test-component>Text content</test-component>'),
      litHtmlFixtureSync(html`<test-component>Text content</test-component>`),
    ].forEach(testElement);
    (await Promise.all([
      htmlFixture('<test-component>Text content</test-component>'),
      litHtmlFixture(html`<test-component>Text content</test-component>`),
    ])).forEach(testElement);
  });

  it('wraps element into a div attached to the body', async () => {
    function testElement(element) {
      expect(element.parentNode).to.be.an.instanceof(HTMLDivElement);
      expect(element.parentNode.parentNode).to.equal(document.body);
    }
    [
      htmlFixtureSync('<test-component></test-component>'),
      litHtmlFixtureSync(html`<test-component></test-component>`),
    ].forEach(testElement);
    (await Promise.all([
      htmlFixture('<test-component></test-component>'),
      litHtmlFixture(html`<test-component></test-component>`),
    ])).forEach(testElement);
  });

  it('allows to create several fixtures in one test', async () => {
    function testElement(element) {
      expect(element).to.be.an.instanceof(TestComponent);
      expect(element.parentNode).to.be.an.instanceof(HTMLDivElement);
      expect(element.parentNode.parentNode).to.equal(document.body);
    }
    [
      htmlFixtureSync('<test-component></test-component>'),
      htmlFixtureSync('<test-component></test-component>'),
      litHtmlFixtureSync(html`<test-component></test-component>`),
      litHtmlFixtureSync(html`<test-component></test-component>`),
    ].forEach(testElement);
    (await Promise.all([
      htmlFixture('<test-component></test-component>'),
      htmlFixture('<test-component></test-component>'),
      litHtmlFixture(html`<test-component></test-component>`),
      litHtmlFixture(html`<test-component></test-component>`),
    ])).forEach(testElement);
  });

  it('handles self closing tags', async () => {
    function testElement(element) {
      expect(element).to.be.an.instanceof(TestComponent);
    }
    [
      htmlFixtureSync('<test-component/>'),
      litHtmlFixtureSync(html`<test-component/>`),
    ].forEach(testElement);
    (await Promise.all([
      htmlFixture('<test-component/>'),
      litHtmlFixture(html`<test-component/>`),
    ])).forEach(testElement);
  });

  it('always returns first child element ignoring whitespace and other elements', async () => {
    function testElement(element) {
      expect(element).to.be.an.instanceof(TestComponent);
    }
    [
      htmlFixtureSync(`
        <test-component></test-component>
        <div></div>
      `),
      litHtmlFixtureSync(html`
        <test-component></test-component>
        <div></div>
      `),
    ].forEach(testElement);
    (await Promise.all([
      htmlFixture(`
        <test-component></test-component>
        <div></div>
      `),
      litHtmlFixture(html`
        <test-component></test-component>
        <div></div>
      `),
    ])).forEach(testElement);
  });
});

describe('htmlFixtureSync & htmlFixture', () => {
  it('accepts root element properties via second argument as an object', async () => {
    const elementSync = htmlFixtureSync('<div></div>', {
      myProp: 'value',
    });
    expect(elementSync.myProp).to.equal('value');

    const elementAsync = await htmlFixture('<div></div>', {
      myProp: 'value',
    });
    expect(elementAsync.myProp).to.equal('value');
  });

  it('accepts root element properties via second argument as a function with "element" argument', async () => {
    const elementSync = htmlFixtureSync('<div></div>', element => ({
      myProp: `access-to-${element.tagName}-instance`,
    }));
    expect(elementSync.myProp).to.equal('access-to-DIV-instance');

    const elementAsync = await htmlFixture('<div></div>', element => ({
      myProp: `access-to-${element.tagName}-instance`,
    }));
    expect(elementAsync.myProp).to.equal('access-to-DIV-instance');
  });
});

describe('litHtmlFixtureSync & litHtmlFixture', () => {
  it('supports lit-html', async () => {
    const myFunction = () => {};

    function testElement(element) {
      expect(element.propNumber).to.equal(10);
      expect(element.propFunction).to.equal(myFunction);
    }

    const elementSync = litHtmlFixtureSync(html`
      <test-component .propNumber=${10} .propFunction=${myFunction}></test-component>
    `);
    testElement(elementSync);

    const elementAsync = await litHtmlFixture(html`
      <test-component .propNumber=${10} .propFunction=${myFunction}></test-component>
    `);
    testElement(elementAsync);
  });
});
