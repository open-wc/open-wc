# Chai A11y aXe

[//]: # (AUTO INSERT HEADER PREPUBLISH)

This module provides a Chai plugin to perform automated accessibility tests via axe.

::: tip
This is part of the default [open-wc testing](https://open-wc.org/testing/) recommendation
:::

## Testing for Accessibility

With `chai-a11y-axe` you can easily test your web component for common accessibility problems. However, you should still run manual a11y audits to catch the kinds of problems that [automatic testing cannot](https://www.smashingmagazine.com/2018/09/importance-manual-accessibility-testing/).

> ⚠️ Make sure to also run manualy accessibility audits on your components, as automated tests can't cover every issue.

## Setup
In order to run a11y tests, import `chai-a11y-axe` and register it with Chai

If you use [open-wc's default config](https://open-wc.org/testing), `chai-a11y-axe` is already registered, so you can skip the rest of this section.

```js
import chai from 'chai';
import chaiA11yAxe from 'chai-a11y-axe';
chai.use(chaiA11yAxe);
```
If you are using karma, you an instead add this to your `karma.conf.js`:

```js
files: [
  // ... existing files config
  require.resolve('axe-core/axe.min.js'),
],
```

### Chai BDD UI

The BDD UI works with chai's `expect` function.

Because the test is asynchronous, you must either await its result or pass a `done` parameter in the plugin's options object.

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

### Chai TDD UI

The `isAccessible()` and `isNotAccessible()` methods work on Chai's `assert` function.

```js
import { fixture, assert, html } from '@open-wc/testing';

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
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/chai-a11y-axe/README.md';
      }
    }
  }
</script>
