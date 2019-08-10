# Testing

[//]: # (AUTO INSERT HEADER PREPUBLISH)

An opinionated package that combines and configures testing libraries to minimize the amount of ceremony required when writing tests.

## Testing helpers
Exposes all functions of [@open-wc/testing-helpers](https://open-wc.org/testing/testing-helpers.html), so that you have a single package to import from:

```javascript
import { html } from 'lit-html';
import { fixture } from '@open-wc/testing';

describe('my-test', () => {
  it('works', async () => {
    const element = await fixture(html`<my-element></my-element>`);
  });
});
```

## Chai
Exposes chai as an es module with useful plugins pre-configured:

[@open-wc/semantic-dom-diff](https://www.npmjs.com/package/@open-wc/semantic-dom-diff) for snapshot testing:

```javascript
import { html } from 'lit-html';
import { expect, fixture } from '@open-wc/testing';

describe('my-test', () => {
  it('works', async () => {
    const element = await fixture(html`<my-element></my-element>`);
    expect(element).shadowDom.to.equalSnapshot();
  });
});
```

[@open-wc/chai-a11y-axe](https://www.npmjs.com/package/@open-wc/semantic-dom-diff) for a11y testing:

```javascript
import { html } from 'lit-html';
import { expect, fixture } from '@open-wc/testing';

describe('my-test', () => {
  it('works', async () => {
    const element = await fixture(html`<my-element></my-element>`);
    expect(element).to.be.accessible();
  });
});
```

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/testing/README.md';
      }
    }
  }
</script>
