# Testing Event Listeners in lifecycle events

Let's say you have a mixin that dispatches an event on `firstUpdated` and `connectedCallback`:
```js
const mixin = superclass => class extends superclass {
  firstUpdated() {
    super.firstUpdated();
    this.dispatchEvent(new CustomEvent('first-updated'));
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(new CustomEvent('connected-callback'));
  }
};
```

These are the suggested ways of testing these events:

#### firstUpdated

Testing `firstUpdated` is a little tricky. As soon as you add the component to the DOM, it is executed——with an arbitrary delay depending on the work your component does (https://lit-element.polymer-project.org/guide/lifecycle#firstupdated).

To test this, you can use `fixtureSync` and `await oneEvent` to resolve the event.

```js
it('dispatches a custom event on firstUpdated', async () => {
  const tag = class extends mixin(LitElement) {};
  const el = fixtureSync(`<${tag}></${tag}>`);
  const ev = await oneEvent(el, 'first-updated');
  expect(ev).to.exist;
});
```


#### connectedCallback

For `connectedCallback`, you can just call the function in a `setTimeout`.

```js
it('test', async () => {
  const tag = defineCE(class Foo extends readyMixin(LionLitElement) {});
  const el = await fixture(`<${tag}></${tag}>`);
  setTimeout(() => el.connectedCallback());
  const ev = await oneEvent(el, 'connected-callback');
  expect(ev).to.exist;
});
```
