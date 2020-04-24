# Testing with sinon

[Sinon](https://sinonjs.org/) is a library that lets you set up mocks, spies, and stubs in javascript. They ship an es-module version, so it's easy to use it in your tests:

Add Sinon as a dependency:

```bash
npm i -D sinon
```

Use it in your tests:

```javascript
import { stub } from 'sinon';
import { expect, fixture, html } from '@open-wc/testing';

describe('my component', () => {
  it('calls myFunction when a button is clicked', async () => {
    const el = await fixture(html` <my-component></my-component> `);

    // stub a function
    const myFunctionStub = stub(el, 'myFunction');

    // click a button
    el.shadowRoot.getElementById('myButton').click();

    // check if the function was called
    expect(myFunctionStub).to.have.callCount(1);
  });
});
```

```javascript
class MyComponent extends LitElement {
  myFunction(e) {
    console.log(e);
  }
  render() {
    return html` <button @click=${e => this.myFunction(e)}>click</button> `;
  }
}

customElements.define('my-component', MyComponent);
```

See the [sinon documentation](https://sinonjs.org/) to learn how to use the different features.

If you run into any problems trying to stub methods on component, please check out the [FAQ](/faq).
