# Knowledge >> Testing >> Stubs || 30

Given the following code:

`my-component.js`:

```js
// example #1
class MyComponent extends LitElement {
  myFunction() {
    // ...
  }
  render() {
    return html` <button @click=${this.myFunction}>click</button> `;
  }
}
```

You may be surprised to find that the following test will fail, `my-component.test.js`:

```js
import { stub } from 'sinon';
import { expect, fixture, html } from '@open-wc/testing';

describe('my component', () => {
  it('calls myFunction when a button is clicked', () => {
    const el = fixture(html` <my-component></my-component> `);
    const myFunctionStub = stub(el, 'myFunction');
    el.shadowRoot.querySelector('button').click();
    expect(myFunctionStub).to.have.callCount(1);
  });
});
```

The following, however, will pass:

```js
// example #2
render() {
  return html`<button @click=${() => this.myFunction()}>click</button>`;
}
```

The reason is that with `example #1` the stubbing(/wrapping) of `myFunction` happens AFTER you pass the function to lit-html, whereas with `example #2` you make fixture, stub `myFunction`, and _then_ when you click it, it will already be stubbed.

How can we solve this? There are a few ways to go about this:

- You can go with `@click=${this.myFunction}`, and then rerender the component in your test to make sure the function is correctly stubbed:

```js
it('does the thing', async () => {
  const el = await fixture(html` <my-component></my-component> `);
  const myFunctionStub = sinon.stub(el, 'myFunction');
  el.requestUpdate();
  await el.updateComplete;
  el.shadowRoot.querySelector('button').click();
  expect(myFunctionStub).to.have.callCount(1);
});
```

- Or you can choose to instead of testing the function has been called, test the side-effects of that function. (e.g.: it fires an event, a property has now been set, etc.)

- As a last resort, you could pass an anonymous function that calls `this.myFunction()`, like so: `@click=${() => this.myFunction()}`. Note that this is not recommended unless its a 100% needed. Some valid usecases for this may be if you need to pass some arguments to the function, e.g.: `@click=${(e) => this.myFunction(e)}`, or `@click=${() => this.myFunction(someOtherData)}`
