# Testing a11y

[//]: # (AUTO INSERT HEADER PREPUBLISH)

This module provides a Mocha plugin to perform automated accessibility tests.

::: tip
This is part of the default [open-wc testing](https://open-wc.org/testing/) recommendation
:::

## Test for accessibility

### Expect library

The plugin provides `accessible()` function to perform accessibility test.

Because the test is asynchronous it has to be performed by returning the value from calling the function, by using async/await, or by using `done()` function that is accepted as an option.

Rules can be ignored by passing `ignoredRules` with list of ignored rules as a configuration option.

```js
import { fixture, expect, html } from '@open-wc/testing';

it('passes accessibility test', async () => {
  const el = await fixture(html`<button>label</button>`);
  await expect(el).to.be.accessible();
});

it('fails without label', async () => {
  const el = await fixture(html`<div aria-labelledby="test-x"></div>`);
  await expect(el).not.to.be.accessible();
});

it('passes for all rules, ignores attributes test', async () => {
  const el = await fixture(html`<div aria-labelledby="test-x"></div>`);
  await expect(el).to.be.accessible({
    ignoredRules: ['aria-valid-attr-value']
  });
});

it('accepts "done" option', (done) => {
  fixture(html`<button>some light dom</button>`)
  .then((el) => {
    expect(el).to.be.accessible({
      done
    });
  });
});
```

### Assert library

The plugin provides `isAccessible()` and `isNotAccessible()` function on `assert` library.

```js
import { fixture, expect, html } from '@open-wc/testing';

it('passes axe accessible tests', async () => {
  const el = await fixture(html`<button>some light dom</button>`);
  await assert.isAccessible(el);
});

it('accepts ignored rules list', async () => {
  const el = await fixture(html`<div aria-labelledby="test-x"></div>`);
  await assert.isAccessible(el, {
    ignoredRules: ['aria-valid-attr-value']
  });
});

it('passes for negation', async () => {
  const el = await fixture(html`<div aria-labelledby="test-x"></div>`);
  await assert.isNotAccessible(el);
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
