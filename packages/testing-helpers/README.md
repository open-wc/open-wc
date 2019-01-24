# Testing Helpers

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

Open Web Components provides a set of defaults, recommendations and tools to help facilitate your Web Component. Our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

In order to efficiently test Web Components you will need some helpers to register and instantiate them for you.

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
If you need to wait for multiple elements to update you can use `nextFrame`.  

```js
import { nextFrame, aTimeout, html, fixture } from '@open-wc/testing-helpers';

const el = await fixture(html`<my-el .foo=${'bar'}></my-el>`);
expect(el.foo).to.equal('bar');
el.foo = 'baz';
await nextFrame();
// or as an alternative us timeout
// await aTimeout(10); // would wait 10ms
expect(el.shadowRoot.querySelector('#foo').innerText).to.equal('baz');
```

## Fixture Cleanup
By default, if you import anything via `import { ... } from '@open-wc/testing-helpers';`, it will automatically register a side-effect that cleans up fixtures.
If you want to be in full control you can do so by using
```js
import { fixture, fixtureCleanup } from '@open-wc/testing-helpers/index-no-side-effects.js';

it('can instantiate an element with properties', async () => {
  const el = await fixture(html`<my-el .foo=${'bar'}></my-el>`);
  expect(el.foo).to.equal('bar');
  fixtureCleanup();
}

// Alternatively, you can do add the fixtureCleanup in the afterEach function, but note that this is exactly what the automatically registered side-effect does.
afterEach(() => {
  fixtureCleanup();
});
```
