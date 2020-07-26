---
permalink: 'testing/testing.html'
title: Testing
section: guides
tags:
  - guides
---

# Testing

An opinionated package that combines and configures testing libraries to minimize the amount of ceremony required when writing tests.

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

## Step by step guide

To help you get started with testing, we recommend [reading this article](https://dev.to/open-wc/testing-workflow-for-web-components-g73) for a great step by step guide.

## Testing helpers

Exposes all functions of [@open-wc/testing-helpers](https://open-wc.org/testing/testing-helpers.html), so that you have a single package to import from:

```javascript
import { fixture, html } from '@open-wc/testing';

describe('my-test', () => {
  it('works', async () => {
    const el = await fixture(html` <my-element></my-element> `);
  });
});
```

## Chai

Exposes chai as an es module with useful plugins pre-configured:

[@open-wc/semantic-dom-diff](https://www.npmjs.com/package/@open-wc/semantic-dom-diff) for dom tree / snapshot testing:

```javascript
import { expect, fixture, html } from '@open-wc/testing';

describe('Plugin - semantic-dom-diff', () => {
  it('can semantically compare full dom trees', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).dom.to.equal('<div><h1>Hey</h1></div>');
  });

  it('can semantically compare lightDom trees', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).lightDom.to.equal('<h1>Hey</h1>');
  });

  it('can compare against a snapshot', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).dom.to.equalSnapshot();
  });
});
```

[@open-wc/chai-a11y-axe](https://www.npmjs.com/package/chai-a11y-axe) for a11y testing:

```javascript
import { expect, fixture, html } from '@open-wc/testing';

describe('my-test', () => {
  it('works', async () => {
    const el = await fixture(html` <my-element></my-element> `);
    await expect(el).to.be.accessible();
  });
});
```

[chai-dom](https://www.npmjs.com/package/chai-dom) for dom testing:

```js
import { fixture, expect } from '@open-wc/testing';

describe('Plugin - chai-dom', () => {
  it('can check for an exiting css class', async () => {
    const el = await fixture(`<div class="foo bar"></div>`);
    expect(el).to.have.class('foo');
  });
});
```
