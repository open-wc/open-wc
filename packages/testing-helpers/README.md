# Testing Helpers

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

We want to provide a good set of defaults on how to facilitate your web component.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

In order to efficient test webcomponent you will need some helpers to register and instantiate them.

::: tip Info
This is part of the default [open-wc](https://open-wc.org/) recommendation
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
import { html, litFixture } from '@open-wc/testing-helpers';

it('can instantiate an element with properties', async () => {
  const el = await litFixture(html`<my-el .foo=${'bar'}></my-el>`);
  expect(el.foo).to.equal('bar');
}
```

## Test a custom class
If you test a mixin or you have multiple base classes that offer a various set of options you will find yourself in the situation of needing multiple custom element names in your tests.
This is rather dangerous as custom elements are global so you do not want to have overlapping names in your tests.
Therefore we recommend using a special function for it.
```js
import { fixture, defineCE } from '@open-wc/testing-helpers';

const tag = defineCE(class extends MyMixin(HTMLElement) {
  constructor() {
    super();
    this.foo = true;
  }
});
const el = fixture(`<${tag}></${tag}>`);
expect(el.foo).to.be.true;
```

## Test a custom class with properties
For lit-html it's a little tougher as it does not support dynamic tag names by default.  
This is using a "workaround" which is not performant for rerenders.
As this is usually not a problem for tests it's ok here but do NOT use it in production code.

```js
import { html, litFixture, defineCE, unsafeStatic } from '@open-wc/testing-helpers';

const tagName = defineCE(class extends MyMixin(HTMLElement) {
  constructor() {
    super();
    this.foo = true;
  }
});
const tag = unsafeStatic(tagName);
const el = litFixture(html`<${tag} .bar=${'baz'}></${tag}>`);
expect(el.bar).to.equal('baz');
```

## Timings
If you need to wait for multiple elements to update you can use flush.  
By default it will be a timeout of 2ms but it will use a `window.flush` method if set.

```js
import { flush, aTimeout, html, litFixture } from '@open-wc/testing-helpers';

const el = await litFixture(html`<my-el .foo=${'bar'}></my-el>`);
expect(el.foo).to.equal('bar');
el.foo = 'baz';
await flush();
// or as an alternative us timeout
// await aTimeout(10); // would wait 10ms
expect(el.shadowRoot.querySelector('#foo').innerText).to.equal('baz');
```
