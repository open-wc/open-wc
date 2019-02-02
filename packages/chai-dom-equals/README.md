# Testing Chai Dom Equals

[//]: # (AUTO INSERT HEADER PREPUBLISH)

Usually, you don't want to literally compare dom when testing your Web Components. Additionally, when using ShadyDOM and/or ShadyCSS there will be additional classes you are not interested in. This package provides a solution for that problem.

::: tip
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

## Manual Setup

Add the following after chai is loaded

```js
import { chai } from '@bundled-es-modules/chai';
import { chaiDomEquals } from '@open-wc/chai-dom-equals';

chai.use(chaiDomEquals);
```

## Test dom of an element
```js
it('has the following dom', async () => {
  const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
  expect(el).dom.to.equal('<div><h1>Hey</h1></div>');
});
```

## Test shadow dom of an element
```js
it('has the following shadow dom', async () => {
  const tag = defineCE(class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = '<p>  shadow content</p> <!-- comment --> <slot></slot>';
    }
  });
  const el = await fixture(`<${tag}></${tag}>`);
  expect(el).shadowDom.to.equal('<p>shadow content</p><slot>');
});
```

## Literal matching
By default dom is diffed 'semantically'. Differences in whitespace, newlines, attributes/class order are ignored and style, script and comment nodes are removed.

If you want to match literally instead you can use some of the provided utilities to handle diffing on browsers with the shadow dom polyfill:

```javascript
import { getOuterHtml, getCleanedShadowDom } from '@open-wc/chai-dom-equals';

it('literally equals', () => {
  const tag = defineCE(class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = '<p>  shadow content</p> <!-- comment --> <slot></slot>';
    }
  });
  const el = await fixture(`<${tag}></${tag}>`);
  const outerHTML = getOuterHtml(el);
  const innerHTML = getCleanedShadowDom(el);

  expect(outerHTML).to.equal(`<${tag}></${tag}>`);
  expect(innerHTML).to.equal('<p>  shadow content</p> <!-- comment --> <slot></slot>');
});

```