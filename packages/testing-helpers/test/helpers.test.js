import { expect } from './setup.js';
import { defineCE, oneEvent, triggerFocusFor, triggerBlurFor, fixture } from '../index.js';

describe('Helpers', () => {
  it('provides defineCE() to register a unique new element', async () => {
    const TestClass1 = class extends HTMLElement {};
    const TestClass2 = class extends HTMLElement {};
    const elementName1 = defineCE(TestClass1);
    const elementName2 = defineCE(TestClass2);
    const element1 = document.createElement(elementName1);
    const element2 = document.createElement(elementName2);
    expect(elementName1).to.not.equal(elementName2);
    expect(element1.constructor).to.equal(TestClass1);
    expect(element2.constructor).to.equal(TestClass2);
  });

  it('provides oneEvent() to await an event beeing fired', async () => {
    const el = document.createElement('div');
    const detail = { some: 'thing' };
    const customEvent = new CustomEvent('my-custom-event', { detail });

    setTimeout(() => el.dispatchEvent(customEvent));

    const ev = await oneEvent(el, 'my-custom-event');
    expect(ev).to.be.an.instanceOf(CustomEvent);
    expect(ev).to.equal(customEvent);
    expect(ev.detail).to.equal(detail);
  });

  it('provides triggerFocusFor() to await a focus event (for IE)', async () => {
    class FocusElement extends HTMLElement {
      connectedCallback() {
        this.focusCount = 0;
        this.inputElement = this.querySelector('input');
        this.inputElement.addEventListener('focus', () => {
          this.focusCount += 1;
        });
      }
    }

    const tag = defineCE(FocusElement);
    /** @type {FocusElement} */
    const el = await fixture(`<${tag}><input></${tag}>`);
    expect(el.focusCount).to.equal(0);

    await triggerFocusFor(el.inputElement);
    expect(el.focusCount).to.equal(1);
  });

  it('provides triggerBlurFor() to await a blur event (for IE)', async () => {
    class FocusElement extends HTMLElement {
      connectedCallback() {
        this.blurCount = 0;
        this.inputElement = this.querySelector('input');
        this.inputElement.addEventListener('blur', () => {
          this.blurCount += 1;
        });
        this.inputElement.focus();
      }
    }

    const tag = defineCE(FocusElement);
    /** @type {FocusElement} */
    const el = await fixture(`<${tag}><input></${tag}>`);
    expect(el.blurCount).to.equal(0);

    await triggerBlurFor(el.inputElement);
    expect(el.blurCount).to.be.within(0, 1);
    expect(el !== document.activeElement).to.be.true;
  });
});
