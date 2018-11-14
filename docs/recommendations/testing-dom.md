# Testing Chai Dom Equals

Comparing dom literally is usually not what you want when testing components.
Additional classes or just 

::: tip Info
This is part of the default testing recommendations
:::

## Manual Setup

Add the following after chai is loaded

```js
import { chaiDomEquals } from '@open-wc/chai-dom-equals';

window.chai.use(chaiDomEquals);
```

## Test dom of an element
```js
it('has the following dom', async () => {
  const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
  expect(el).dom.to.equal('<div><!-- comment --><h1>Hey  </h1>  </div>');
  expect(el).dom.to.semantically.equal('<div><h1>Hey</h1></div>');
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
  expect(el).shadowDom.to.equal('<p>  shadow content</p> <!-- comment --> <slot></slot>');
  expect(el).shadowDom.to.semantically.equal('<p>shadow content</p><slot>');
});
```
