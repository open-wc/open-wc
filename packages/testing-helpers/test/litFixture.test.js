import {
  html,
  fixture,
  fixtureSync,
  litFixture,
  litFixtureSync,
} from '../index.js';

class TestComponent extends HTMLElement {}
customElements.define('test-component', TestComponent);

describe('fixtureSync & litFixtureSync & fixture & litFixture', () => {
  it('asynchronously returns an element node', async () => {
    function testElement(element) {
      expect(element).to.be.an.instanceof(TestComponent);
      expect(element.textContent).to.equal('Text content');
    }
    [
      fixtureSync('<test-component>Text content</test-component>'),
      litFixtureSync(html`<test-component>Text content</test-component>`),
    ].forEach(testElement);
    (await Promise.all([
      fixture('<test-component>Text content</test-component>'),
      litFixture(html`<test-component>Text content</test-component>`),
    ])).forEach(testElement);
  });

  it('wraps element into a div attached to the body', async () => {
    function testElement(element) {
      expect(element.parentNode).to.be.an.instanceof(HTMLDivElement);
      expect(element.parentNode.parentNode).to.equal(document.body);
    }
    [
      fixtureSync('<test-component></test-component>'),
      litFixtureSync(html`<test-component></test-component>`),
    ].forEach(testElement);
    (await Promise.all([
      fixture('<test-component></test-component>'),
      litFixture(html`<test-component></test-component>`),
    ])).forEach(testElement);
  });

  it('allows to create several fixtures in one test', async () => {
    function testElement(element) {
      expect(element).to.be.an.instanceof(TestComponent);
      expect(element.parentNode).to.be.an.instanceof(HTMLDivElement);
      expect(element.parentNode.parentNode).to.equal(document.body);
    }
    [
      fixtureSync('<test-component></test-component>'),
      fixtureSync('<test-component></test-component>'),
      litFixtureSync(html`<test-component></test-component>`),
      litFixtureSync(html`<test-component></test-component>`),
    ].forEach(testElement);
    (await Promise.all([
      fixture('<test-component></test-component>'),
      fixture('<test-component></test-component>'),
      litFixture(html`<test-component></test-component>`),
      litFixture(html`<test-component></test-component>`),
    ])).forEach(testElement);
  });

  it('handles self closing tags', async () => {
    function testElement(element) {
      expect(element).to.be.an.instanceof(TestComponent);
    }
    [
      fixtureSync('<test-component/>'),
      litFixtureSync(html`<test-component/>`),
    ].forEach(testElement);
    (await Promise.all([
      fixture('<test-component/>'),
      litFixture(html`<test-component/>`),
    ])).forEach(testElement);
  });

  it('always returns first child element ignoring whitespace and other elements', async () => {
    function testElement(element) {
      expect(element).to.be.an.instanceof(TestComponent);
    }
    [
      fixtureSync(`
        <test-component></test-component>
        <div></div>
      `),
      litFixtureSync(html`
        <test-component></test-component>
        <div></div>
      `),
    ].forEach(testElement);
    (await Promise.all([
      fixture(`
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

describe('fixtureSync & fixture', () => {
  it('accepts root element properties via second argument as an object', async () => {
    const elementSync = fixtureSync('<div></div>', {
      myProp: 'value',
    });
    expect(elementSync.myProp).to.equal('value');

    const elementAsync = await fixture('<div></div>', {
      myProp: 'value',
    });
    expect(elementAsync.myProp).to.equal('value');
  });

  it('accepts root element properties via second argument as a function with "element" argument', async () => {
    const elementSync = fixtureSync('<div></div>', element => ({
      myProp: `access-to-${element.tagName}-instance`,
    }));
    expect(elementSync.myProp).to.equal('access-to-DIV-instance');

    const elementAsync = await fixture('<div></div>', element => ({
      myProp: `access-to-${element.tagName}-instance`,
    }));
    expect(elementAsync.myProp).to.equal('access-to-DIV-instance');
  });
});

describe('litFixtureSync & litFixture', () => {
  it('supports lit-html', async () => {
    const myFunction = () => {};

    function testElement(element) {
      expect(element.propNumber).to.equal(10);
      expect(element.propFunction).to.equal(myFunction);
    }

    const elementSync = litFixtureSync(html`
      <test-component .propNumber=${10} .propFunction=${myFunction}></test-component>
    `);
    testElement(elementSync);

    const elementAsync = await litFixture(html`
      <test-component .propNumber=${10} .propFunction=${myFunction}></test-component>
    `);
    testElement(elementAsync);
  });
});
