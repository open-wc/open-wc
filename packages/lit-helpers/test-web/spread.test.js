import { expect, fixture } from '@open-wc/testing';
import { LitElement, html, render } from 'lit';
import { spread, spreadProps, spreadEvents } from '../index.js';

class SpreadTestElement extends LitElement {
  static get properties() {
    return {
      string: { type: String },
      number: { type: Number },
      array: { type: Array },
      object: { type: Object },
    };
  }

  constructor() {
    super();
    this.string = '';
    this.number = 0;
    this.array = [];
    this.object = {};
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('spread-test-element', SpreadTestElement);

describe('spread', () => {
  const string = 'Hello, I am a string.';
  const number = 42;
  const array = 'This is an array.'.split(' ');
  const object = {
    foo: 'bar',
    baz: true,
    bar: false,
  };
  const testArray = ['This', 'is', 'a', 'test', 'array.'];
  describe('branded', () => {
    it('spreads', async () => {
      let clickTest = 0;
      const properties = {
        string,
        number,
        '.array': array,
        '.object': object,
        '@click': () => {
          clickTest += 1;
        },
      };
      const el = await fixture(html`
        <spread-test-element ${spread(properties)}></spread-test-element>
      `);

      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.array).to.deep.equal(array);
      expect(el.object).to.deep.equal(object);
      expect(clickTest).to.equal(0);
      el.click();
      expect(clickTest).to.equal(1);
    });

    it('binds to the same event name in multiple spreads', async () => {
      let clickTest1 = 0;
      let clickTest2 = 0;
      const properties1 = {
        '@click': () => {
          clickTest1 += 1;
        },
      };
      const properties2 = {
        '@click': () => {
          clickTest2 += 1;
        },
      };
      const el = await fixture(html`
        <spread-test-element ${spread(properties1)} ${spread(properties2)}></spread-test-element>
      `);
      expect(clickTest1).to.equal(0);
      expect(clickTest2).to.equal(0);
      el.click();
      expect(clickTest2).to.equal(1);
      expect(clickTest2).to.equal(1);
    });

    it('releases properties removed from objects', async () => {
      const test = await fixture(html`<div></div>`);
      const binding = spreadSource => html`
        <spread-test-element ${spread(spreadSource)}></spread-test-element>
      `;
      const properties = {
        string,
        number,
        '.array': array,
        '.object': object,
      };
      render(binding(properties), test);
      const el = test.querySelector('spread-test-element');
      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.array).to.equal(array);
      expect(el.object).to.equal(object);
      delete properties['.array'];
      render(binding(properties), test);
      expect(el.array).to.not.equal(array);
      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.object).to.equal(object);
    });

    it('releases properties to bindings later in the element', async () => {
      const test = await fixture(html`<div></div>`);
      const binding = (spreadSource, arraySource) => html`
        <spread-test-element ${spread(spreadSource)} .array=${arraySource}></spread-test-element>
      `;
      const properties = {
        string,
        number,
        '.array': array,
        '.object': object,
      };
      render(binding(properties, testArray), test);
      const el = test.querySelector('spread-test-element');
      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.array).to.not.equal(array);
      expect(el.array).to.equal(testArray);
      expect(el.object).to.equal(object);
      delete properties['.array'];
      render(binding(properties, testArray), test);
      expect(el.array).to.not.equal(array);
      expect(el.array).to.equal(testArray);
      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.object).to.equal(object);
    });

    it('releases properties to bindings earlier in the element', async () => {
      const test = await fixture(html`<div></div>`);
      const binding = (spreadSource, propertySource) => html`
        <spread-test-element .array=${propertySource} ${spread(spreadSource)}></spread-test-element>
      `;
      const properties = {
        string,
        number,
        '.array': array,
        '.object': object,
      };
      render(binding(properties, testArray), test);
      const el = test.querySelector('spread-test-element');
      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.array).to.equal(array);
      expect(el.object).to.equal(object);
      delete properties['.array'];
      render(binding(properties, testArray), test);
      expect(el.array).to.not.equal(array);
      expect(el.array).to.equal(testArray);
      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.object).to.equal(object);
    });
  });
  describe('events only', () => {
    it('spreads', async () => {
      let myEventCount = 0;
      let myOtherEventCount = 0;
      let myAdditionalEventCount = 0;
      const properties = {
        'my-event': () => {
          myEventCount += 1;
        },
        'my-other-event': () => {
          myOtherEventCount += 1;
        },
        'my-additional-event': () => {
          myAdditionalEventCount += 1;
        },
      };
      const el = await fixture(html`
        <spread-test-element ${spreadEvents(properties)}></spread-test-element>
      `);

      expect(myEventCount).to.equal(0);
      expect(myOtherEventCount).to.equal(0);
      expect(myAdditionalEventCount).to.equal(0);
      el.dispatchEvent(new Event('my-event'));
      el.dispatchEvent(new Event('my-other-event'));
      el.dispatchEvent(new Event('my-additional-event'));
      expect(myEventCount).to.equal(1);
      expect(myOtherEventCount).to.equal(1);
      expect(myAdditionalEventCount).to.equal(1);
    });

    it('binds to the same event name in multiple spreads', async () => {
      let myEventCount = 0;
      let myOtherEventCount = 0;
      let myAdditionalEventCount = 0;
      const properties = {
        'my-event': () => {
          myEventCount += 1;
        },
        'my-other-event': () => {
          myOtherEventCount += 1;
        },
        'my-additional-event': () => {
          myAdditionalEventCount += 1;
        },
      };
      const el = await fixture(html`
        <spread-test-element
          ${spreadEvents(properties)}
          ${spreadEvents(properties)}
        ></spread-test-element>
      `);

      expect(myEventCount).to.equal(0);
      expect(myOtherEventCount).to.equal(0);
      expect(myAdditionalEventCount).to.equal(0);
      el.dispatchEvent(new Event('my-event'));
      el.dispatchEvent(new Event('my-other-event'));
      el.dispatchEvent(new Event('my-additional-event'));
      expect(myEventCount).to.equal(2);
      expect(myOtherEventCount).to.equal(2);
      expect(myAdditionalEventCount).to.equal(2);
    });
  });
  describe('props only', () => {
    it('spreads', async () => {
      const properties = {
        string,
        number,
        array,
        object,
      };
      const el = await fixture(html`
        <spread-test-element ${spreadProps(properties)}></spread-test-element>
      `);

      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.array).to.equal(array);
      expect(el.object).to.equal(object);
    });

    it('releases properties removed from objects', async () => {
      const test = await fixture(html`<div></div>`);
      const binding = spreadSource => html`
        <spread-test-element ${spreadProps(spreadSource)}></spread-test-element>
      `;
      const properties = {
        string,
        number,
        array,
        object,
      };
      render(binding(properties), test);
      const el = test.querySelector('spread-test-element');
      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.array).to.equal(array);
      expect(el.object).to.equal(object);
      delete properties.array;
      render(binding(properties), test);
      expect(el.array).to.not.equal(array);
      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.object).to.equal(object);
    });

    it('releases properties to bindings later in the element', async () => {
      const test = await fixture(html`<div></div>`);
      const binding = (spreadSource, arraySource) => html`
        <spread-test-element
          ${spreadProps(spreadSource)}
          .array=${arraySource}
        ></spread-test-element>
      `;
      const properties = {
        string,
        number,
        array,
        object,
      };
      render(binding(properties, testArray), test);
      const el = test.querySelector('spread-test-element');
      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.array).to.not.equal(array);
      expect(el.array).to.equal(testArray);
      expect(el.object).to.equal(object);
      delete properties['.array'];
      render(binding(properties, testArray), test);
      expect(el.array).to.not.equal(array);
      expect(el.array).to.equal(testArray);
      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.object).to.equal(object);
    });

    it('releases properties to bindings earlier in the element', async () => {
      const test = await fixture(html`<div></div>`);
      const binding = (spreadSource, propertySource) => html`
        <spread-test-element
          .array=${propertySource}
          ${spreadProps(spreadSource)}
        ></spread-test-element>
      `;
      const properties = {
        string,
        number,
        array,
        object,
      };
      render(binding(properties, testArray), test);
      const el = test.querySelector('spread-test-element');
      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.array).to.equal(array);
      expect(el.object).to.equal(object);
      delete properties.array;
      render(binding(properties, testArray), test);
      expect(el.array).to.not.equal(array);
      expect(el.array).to.equal(testArray);
      expect(el.string).to.equal(string);
      expect(el.number).to.equal(number);
      expect(el.object).to.equal(object);
    });

    it('allows the last in update to win', async () => {
      const test = await fixture(html`<div></div>`);
      const binding = (spreadSource, propertySource) => html`
        <spread-test-element
          .array=${propertySource}
          ${spreadProps(spreadSource)}
        ></spread-test-element>
      `;
      const properties = {
        array,
      };
      const otherArray = 'This is a new array.'.split(' ');
      render(binding(properties, testArray), test);
      const el = test.querySelector('spread-test-element');
      expect(el.array).to.equal(array);
      render(binding(properties, otherArray), test);
      expect(el.array).to.not.equal(array);
      expect(el.array).to.equal(otherArray);
    });
  });
});
