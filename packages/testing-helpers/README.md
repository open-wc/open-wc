---
permalink: 'testing/testing-helpers.html'
title: Testing Helpers
section: guides
tags:
  - guides
---

# Testing Helpers

A library with helpers functions for testing in the browser.

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

<div class="custom-block warning"><p class="custom-block-title">WARNING</p> <p>Testing helpers uses <a href="https://lit-html.polymer-project.org/" target="_blank" rel="noopener noreferrer">lit-html<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg></a>, but it's set up as a peer dependency to avoid version conflicts.</p> <p>You don't need to write your components with lit-html to use this library, but you will need to install it:</p> <div class="language-bash extra-class"><pre class="language-bash"><code><span class="token function">npm</span> i -D lit-html
</code></pre></div></div>

# Usage

We recommend using this library through [@open-wc/testing](https://open-wc.org/testing/testing.html) which preconfigures and combines this library with other testing libraries.

The examples that are shown here assume this setup, and import from `@open-wc/testing`. If you want to use this library standalone, you will need to import from `@open-wc/testing-helpers` directly instead:

```javascript
// import from general testing library
import { fixture } from '@open-wc/testing';

// import from testing-helpers directly
import { fixture } from '@open-wc/testing-helpers';
```

## Test fixtures

A test fixture renders a piece of HTML and injects into the DOM so that you can test the behavior of your component. It returns the first dom element from the template so that you can interact with it if needed. For example you can call functions, look up dom nodes or inspect the rendered HTML.

Test fixtures are async to ensure rendering is properly completed.

### Templates

Test fixtures can be set up by using a string or a [lit-html](https://github.com/Polymer/lit-html) template. You don't need to use `lit-html` in your project to use the test fixtures, it just renders standard HTML.

### Test a custom element

```js
import { fixture } from '@open-wc/testing';

it('can instantiate an element', async () => {
  const el = await fixture('<my-el foo="bar"></my-el>');
  expect(el.getAttribute('foo')).to.equal('bar');
}
```

### Test a custom element with properties

```js
import { html, fixture } from '@open-wc/testing';

it('can instantiate an element with properties', async () => {
  const el = await fixture(html` <my-el .foo=${'bar'}></my-el> `);
  expect(el.foo).to.equal('bar');
});
```

### Test a custom class

If you're testing a mixin, or have multiple base classes that offer a various set of options you might find yourself in the situation of needing multiple custom element names in your tests. This can be dangerous as custom elements are global, so you don't want to have overlapping names in your tests. We recommend using the `defineCE` function to avoid that:

```js
import { fixture, defineCE } from '@open-wc/testing';

const tag = defineCE(
  class extends MyMixin(HTMLElement) {
    constructor() {
      super();
      this.foo = true;
    }
  },
);
const el = await fixture(`<${tag}></${tag}>`);
expect(el.foo).to.be.true;
```

## Test a custom class with properties

For lit-html it's a little tougher as it does not support dynamic tag names by default.
This uses a workaround that's not performant for rerenders, which is fine for testing, but do NOT use this in production code.

```js
import { html, fixture, defineCE, unsafeStatic } from '@open-wc/testing';

const tagName = defineCE(
  class extends MyMixin(HTMLElement) {
    constructor() {
      super();
      this.foo = true;
    }
  },
);
const tag = unsafeStatic(tagName);
const el = await fixture(html`<${tag} .bar=${'baz'}></${tag}>`);
expect(el.bar).to.equal('baz');
```

## Customize the fixture container

Ordinarily, `fixture` will render your template as a child of a plain `<div>` element on the test page:

```js
const el = await fixture(html`<my-el></my-el>`);
```

```html
<div><my-el></my-el></div>
```

This should suffice for most cases, but if you need to specify the type of element that contains your custom element fixture, (e.g., to give it an absolute position), you can pass the wrapping node in the `parentNode` option:

```js
const parentNode = document.createElement('div');
parentNode.setAttribute('style', 'position:absolute;');
const el = await fixture(html`<my-el></my-el>`, { parentNode });
```

```html
<div style="position:absolute;"><my-el></my-el></div>
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
const el = await fixture(html` <my-el .foo=${'bar'}></my-el> `);
expect(el.foo).to.equal('bar');

// vs

const el = fixtureSync(html` <my-el .foo=${'bar'}></my-el> `);
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

### waitUntil

Waits until the given condition returns true. This is useful when elements do async work.

`waitUntil` can slow down the execution of tests, it should only be used when you don't have any other more reliable hooks.

```js
import { fixture, waitUntil } from '@open-wc/testing-helpers';

const element = await fixture(html` <my-element></my-element> `);

// wait until some async property is set
await waitUntil(() => element.someAsyncProperty, 'Element did not become ready');

// wait until some child element is rendered
await waitUntil(
  () => element.shadowRoot.querySelector('my-child-element'),
  'Element did not render children',
);
```

`waitUntil` has a default timeout of 2000ms and a polling interval of 50ms. This can be customized:

```js
await waitUntil(predicate, 'Element should become visible', { interval: 10, timeout: 10000 });
```

The predicate can return a promise.

### elementUpdated

If you want to test attribute and property changes, and an easy way to wait for those changes to propagate, you can import the `elementUpdated` helper (also available directly in the `testing` package)

```js
import { fixture, elementUpdated } from '@open-wc/testing';
import '../my-component.js';

describe('Attributes', () => {
  describe('.title', () => {
    //...
    it('is bound to the `title` attribute', async () => {
      const el = await fixture('<my-component title="test"></my-component>');
      expect(el.title).to.eq('test');

      el.title = 'test 2';
      await elementUpdated(el);
      expect(el).dom.to.equal(`<my-component title="test 2"></my-component>`);
    });
    //...
  });
});
```

## Testing Events

If you want to interact with web components you will sometimes need to await a specific event before you can continue testing.
Ordinarily, you might pass the `done` callback to a test, and call it in the body of an event handler.
This does not work with async test functions, though, which must return a promise instead of calling the `done` callback.
The `oneEvent` function helps you handle events in the context of the kinds of async test functions that we recommend.
`oneEvent` resolves with the event specified when it fires on the element specified.

```js
import { oneEvent } from '@open-wc/testing';

class FiresDone extends HTMLElement {
  fireDone() {
    this.done = true;
    this.dispatchEvent(new CustomEvent('done', { detail: this.done }));
  }
}

it('can await an event', async () => {
  const tag = defineCE(FiresDone);

  const el = await fixture(`<${tag}></${tag}>`);

  setTimeout(() => el.fireDone());

  const { detail } = await oneEvent(el, 'done');

  expect(el.done).to.be.true;
  expect(detail).to.be.true;
});
```

## Testing Focus & Blur on IE11

Focus and blur events are synchronous events in all browsers except IE11.
If you need to support that browser in your tests, you can await `triggerFocusFor` and `triggerBlurFor` helper functions.

```js
import { triggerFocusFor, triggerBlurFor } from '@open-wc/testing';

it('can be focused and blured', async () => {
  const el = await fixture('<input type="text">');

  await triggerFocusFor(el);
  expect(document.activeElement === el).to.be.true;

  await triggerBlurFor(el);
  expect(document.activeElement === el).to.be.false;
});
```

## Fixture Cleanup

By default, if you import anything via `import { ... } from '@open-wc/testing';`, it will automatically register a side-effect that cleans up your fixtures.
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
