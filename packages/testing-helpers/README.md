# Testing Helpers

[//]: # (AUTO INSERT HEADER PREPUBLISH)

In order to efficiently test Web Components you will need some helpers to register and instantiate them for you.

::: tip
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

::: warning
Testing helpers requires as a peer dependency [lit-html](https://lit-html.polymer-project.org/).
You can install it inside your project with npm :
```bash
npm i --save lit-html
```
:::

## Test a custom element
```js
import { fixture } from '@open-wc/testing-helpers';

it('can instantiate an element', async () => {
  const el = await fixture('<my-el foo="bar"></my-el>');
  expect(el.getAttribute('foo')).to.equal('bar');
}
```

## Test a custom element with properties
```js
import { html, fixture } from '@open-wc/testing-helpers';

it('can instantiate an element with properties', async () => {
  const el = await fixture(html`<my-el .foo=${'bar'}></my-el>`);
  expect(el.foo).to.equal('bar');
}
```

## Test a custom class
If you're testing a mixin, or have multiple base classes that offer a various set of options you might find yourself in the situation of needing multiple custom element names in your tests.
This can be dangerous as custom elements are global, so you don't want to have overlapping names in your tests.
Therefore we recommend using a the following function to avoid that.
```js
import { fixture, defineCE } from '@open-wc/testing-helpers';

const tag = defineCE(class extends MyMixin(HTMLElement) {
  constructor() {
    super();
    this.foo = true;
  }
});
const el = await fixture(`<${tag}></${tag}>`);
expect(el.foo).to.be.true;
```

## Test a custom class with properties
For lit-html it's a little tougher as it does not support dynamic tag names by default.  
This uses a workaround that's not performant for rerenders, which is fine for testing, but do NOT use this in production code.

```js
import { html, fixture, defineCE, unsafeStatic } from '@open-wc/testing-helpers';

const tagName = defineCE(class extends MyMixin(HTMLElement) {
  constructor() {
    super();
    this.foo = true;
  }
});
const tag = unsafeStatic(tagName);
const el = await fixture(html`<${tag} .bar=${'baz'}></${tag}>`);
expect(el.bar).to.equal('baz');
```

## Timings
By default fixture awaits the elements "update complete" Promise.
- for [lit-element](https://github.com/polymer/lit-element) that is `el.updateComplete`;
- for [stencil](https://github.com/ionic-team/stencil/) that is `el.componentOnReady()`;

If none of those specfic Promise hooks are found, it will wait for one frame via `await nextFrame()`.<br>
**Note**: this does not guarantee that the element is done rendering - it just waits for the next JavaScript tick.

Essentially, `fixture` creates a synchronous fixture, then waits for the element to finish updating, checking `updateComplete` first, then falling back to `componentReady()`, and `nextFrame()` as a last resort.

This way, you can write your tests more succinctly, without having to explicitly `await` those hooks yourself.
```js
const el = await fixture(html`<my-el .foo=${'bar'}></my-el>`);
expect(el.foo).to.equal('bar');

// vs

const el = fixtureSync(html`<my-el .foo=${'bar'}></my-el>`);
await elementUpdated(el);
expect(el.foo).to.equal('bar');
```

### nextFrame
Uses `requestAnimationFrame` to wait for the next frame.
```js
await nextFrame();
```

### aTimeout
Waits for `x` ms via `setTimeout`;
```js
await aTimeout(10); // would wait 10ms
```

## Testing Events
If you want to interact with web components you will sometimes need to await a specific event before you can continue testing.

```js
it('can await an event', async () => {
  const tag = defineCE(class extends HTMLElement {
    fireDone() {
      this.done = true;
      this.dispatchEvent(new CustomEvent('done'));
    }
  });

  const el = await fixture(`<${tag}></${tag}>`);

  setTimeout(() => el.fireDone());
  await oneEvent(el, 'done');
  expect(el.done).to.be.true;
});
```

## Testing Focus & Blur
Focus and blur events are usually sync but not on IE11 so if you need to support it you can use these little helpers with an await.

```js
it('can be focused and blured', async () => {
  const el = await fixture('<input type="text">');

  await triggerFocusFor(el);
  expect(document.activeElement === el).to.be.true;

  await triggerBlurFor(el);
  expect(document.activeElement === el).to.be.false;
});
```

## Fixture Cleanup
By default, if you import anything via `import { ... } from '@open-wc/testing-helpers';`, it will automatically register a side-effect that cleans up your fixtures.
If you want to be in full control you can do so by using
```js
import { fixture, fixtureCleanup } from '@open-wc/testing-helpers/index-no-side-effects.js';

it('can instantiate an element with properties', async () => {
  const el = await fixture(html`<my-el .foo=${'bar'}></my-el>`);
  expect(el.foo).to.equal('bar');
  fixtureCleanup();
}

// Alternatively, you can add the fixtureCleanup in the afterEach function, but note that this is exactly what the automatically registered side-effect does.
afterEach(() => {
  fixtureCleanup();
});
```

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/testing-helpers/README.md';
      }
    }
  }
</script>
