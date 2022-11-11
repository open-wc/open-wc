# Testing >> Chai A11y aXe ||30

This module provides a Chai plugin to perform automated accessibility tests via axe.

This package is shipped as a dependency with `@open-wc/testing` so you do not need to install this seperately.

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

## Chai BDD UI

The BDD UI works with chai's `expect` function.

Because the test is asynchronous, you must either await its result or pass a `done` parameter in the plugin's options object.

You can ignore tags or ARIA rules, see [configuration](#configuration)

```js
import { fixture, expect, html } from '@open-wc/testing';

it('passes accessibility test', async () => {
  const el = await fixture(html` <button>label</button> `);
  await expect(el).to.be.accessible();
});

it('fails without label', async () => {
  const el = await fixture(html` <div aria-labelledby="test-x"></div> `);
  await expect(el).not.to.be.accessible();
});

it('passes for all rules, ignores attributes test', async () => {
  const el = await fixture(html` <div aria-labelledby="test-x"></div> `);
  await expect(el).to.be.accessible({
    ignoredRules: ['aria-valid-attr-value'],
  });
});

it('fails without alt attribute', async () => {
  const el = await fixture(html` <img /> `);
  await expect(el).not.to.be.accessible();
});

it('passes without alt attribute becuase img are ignored', async () => {
  const el = await fixture(html` <img /> `);
  await expect(el).not.to.be.accessible({
    ignoredTags: ['img'],
  });
});

it('accepts "done" option', done => {
  fixture(html` <button>some light dom</button> `).then(el => {
    expect(el).to.be.accessible({
      done,
    });
  });
});
```

## Chai TDD UI

The `isAccessible()` and `isNotAccessible()` methods work on Chai's `assert` function.

```js
import { fixture, assert, html } from '@open-wc/testing';

it('passes axe accessible tests', async () => {
  const el = await fixture(html` <button>some light dom</button> `);
  await assert.isAccessible(el);
});

it('accepts ignored rules list', async () => {
  const el = await fixture(html` <div aria-labelledby="test-x"></div> `);
  await assert.isAccessible(el, {
    ignoredRules: ['aria-valid-attr-value'],
  });
});

it('passes for negation', async () => {
  const el = await fixture(html` <div aria-labelledby="test-x"></div> `);
  await assert.isNotAccessible(el);
});
```

## <a id="configuration"></a>Configuration

### `ignoredRules`

Rules can be ignored by passing `ignoredRules` with a list of rules as a configuration option. e.g.: `{ ignoredRules: ['aria-valid-attr-value'] }`

Here are all ARIA [rules](https://github.com/dequelabs/axe-core/tree/develop/lib/rules) applied by [axe-core](https://github.com/dequelabs/axe-core). You will also find them in the violations report when running offending tests with this plugin.

This configuration option is passed down to `axe-core` API so that the configured test will run with those rules disabled.

### `ignoredTags`

Ignore elements with a specific tag by passing `ignoredTags` with a list of tags to ignore. e.g.: `{ ignoredTags: ['img'] }`

This configuration option will remove elements from the accessibility tree by setting the [aria-hidden](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden) attribute for them.
