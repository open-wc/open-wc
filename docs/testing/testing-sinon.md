# Testing with sinon

[Sinon](https://sinonjs.org/) is a library that lets you set up mocks, spies, and stubs in javascript. They ship an es-module version, so it's easy to use it in your tests:

Add Sinon as a dependency:
```bash
npm i -D sinon
```

Use it in your tests:
```javascript
import { html } from 'lit-html';
import { stub } from 'sinon';
import { expect, fixture } from '@open-wc/testing';

describe('my component', () => {
  it('calls myFunction when a button is clicked', () => {
    const element = fixture(html`<my-component></my-component>`);

    // stub a function
    const myFunctionStub = stub(element, 'myFunction');

    // click a button
    element.shadowRoot.getElementByid('myButton').click();

    // check if the function was called
    expect(myFunctionStub.calledCount).to.equal(1);
  });
});
```

See the [sinon documentation](https://sinonjs.org/) to learn how to use the different features.