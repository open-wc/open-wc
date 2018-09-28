import {
  registerUniqueElement,
  eventTrigger,
  focusTrigger,
  blurTrigger,
  htmlFixture,
} from '../bdd.js';

describe('Helpers', () => {
  it('provides registerUniqueElement() to register a unique new element', async () => {
    const TestClass1 = class extends HTMLElement {};
    const TestClass2 = class extends HTMLElement {};
    const elementName1 = registerUniqueElement(TestClass1);
    const elementName2 = registerUniqueElement(TestClass2);
    const element1 = document.createElement(elementName1);
    const element2 = document.createElement(elementName2);
    expect(elementName1).to.not.equal(elementName2);
    expect(element1.constructor).to.equal(TestClass1);
    expect(element2.constructor).to.equal(TestClass2);
  });

  it('provides eventTrigger() to await an event beeing fired', async () => {
    const el = document.createElement('div');
    const detail = { some: 'thing' };
    const customEvent = new CustomEvent('my-custom-event', { detail });

    setTimeout(() => el.dispatchEvent(customEvent));

    const event = await eventTrigger(el, 'my-custom-event');
    expect(event).to.be.an.instanceOf(CustomEvent);
    expect(event).to.equal(customEvent);
    expect(event.detail).to.equal(detail);
  });

  it('provides focusTrigger(), blurTrigger() to await a focus/blur event (for IE)', async () => {
    const tag = registerUniqueElement(class FocusElement extends HTMLElement {
      connectedCallback() {
        this.focusCount = 0;
        this.blurCount = 0;
        this.inputElement = this.querySelector('input');
        this.inputElement.addEventListener('focus', () => { this.focusCount += 1; });
        this.inputElement.addEventListener('blur', () => { this.blurCount += 1; });
      }
    });
    const el = await htmlFixture(`<${tag}><input></${tag}>`);
    expect(el.focusCount).to.equal(0);
    expect(el.blurCount).to.equal(0);

    await focusTrigger(el.inputElement);
    expect(el.focusCount).to.equal(1);

    await blurTrigger(el.inputElement);
    expect(el.blurCount).to.equal(1);

    await focusTrigger(el.inputElement);
    await blurTrigger(el.inputElement);
    expect(el.focusCount).to.equal(2);
    expect(el.blurCount).to.equal(2);
  });
});
