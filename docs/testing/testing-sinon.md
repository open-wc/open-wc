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
  it('calls myFunction when a button is clicked', () => {
    const el = fixture(html`
      <my-component></my-component>
    `);

    // stub a function
    const myFunctionStub = stub(el, 'myFunction');

    // click a button
    el.shadowRoot.getElementByid('myButton').click();

    // check if the function was called
    expect(myFunctionStub).to.have.callCount(1);
  });
});
```

See the [sinon documentation](https://sinonjs.org/) to learn how to use the different features.
