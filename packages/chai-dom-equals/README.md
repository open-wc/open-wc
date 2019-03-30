# Chai Dom Equals

[//]: # (AUTO INSERT HEADER PREPUBLISH)

`chai-dom-test` enables you to easily test the rendered dom of test fixture against a snapshot. It integrates [semantic-dom-diff](https://www.npmjs.com/package/@open-wc/semantic-dom-diff) with chai.

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

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/chai-dom-equals/README.md';
      }
    }
  }
</script>
