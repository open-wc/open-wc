# Semantic Dom Diff

[//]: # (AUTO INSERT HEADER PREPUBLISH)

## Manual Setup
```bash
yarn add @open-wc/semantic-dom-diff --dev
```
`semantic-dom-diff` exports a function which takes a string of HTML, and returns a string of HTML. It restructures given HTML string, returning it in a format which can be used for comparison:
- whitespace and newlines are normalized
- tags and attributes are printed on individual lines
- comments, style and script tags are removed
- additional tags and attributes can optionally be ignored

## Basic usage
```javascript
import getDiffableHTML from '@open-wc/semantic-dom-diff';

const leftTree = getDiffableHTML(`
  <div>foo</div>
`);
const rightTree = getDiffableHTML(`
  <div>bar</div>
`);

// use any string comparison tool, for example chai:
expect(leftTree).to.equal(rightTree);
```

## Ignoring tags and attributes
When working with libraries or custom elements there might be parts of the rendered HTML which is random or otherwise outside of your control. In those cases, you might want to ignore certain attributes or tags entirely. This is possible by passing an options object.

### Ignoring an attribute
```javascript
import getDiffableHTML from '@open-wc/semantic-dom-diff';

const leftTree = getDiffableHTML(`
  <div data-my-attribute="someRandomlyGeneratedDataInAnAttribute">
    foo
  </div>
`, { ignoreAttributes: ['data-my-attribute'] });

const rightTree = getDiffableHTML(`
  <div>
    foo
  </div>
`);

// this test will pass, the attribute is ignored
expect(leftTree).to.equal(rightTree);
```

### Ignoring an attribute only for certain tags
Randomly generated ids are often used, throwing off your diffs. You can ignore attributes on specific tags:
```javascript
import getDiffableHTML from '@open-wc/semantic-dom-diff';

const leftTree = getDiffableHTML(`
  <div>
    <input id="someRandomlyGeneratedId">
  </div>
`, { ignoreAttributes: [{ tags: ['input'], attributs: ['id'] }] });

const rightTree = getDiffableHTML(`
  <div>
    <input>
  </div>
`);

// this test will pass, the id attribute is ignored
expect(leftTree).to.equal(rightTree);
```

### Ignoring a tag
Similarly you can tell the diff to ignore certain tags entirely:
```javascript
import getDiffableHTML from '@open-wc/semantic-dom-diff';

const leftTree = getDiffableHTML(`
  <div>
    <my-custom-element><my-custom-element>
    foo
  </div>
`, { ignoreTags: ['my-custom-element'] });

const rightTree = getDiffableHTML(`
  <div>
    foo
  </div>
`);

// this test will pass, the tag is ignored completely
expect(leftTree).to.equal(rightTree);
```

### Ignoring light dom
When working with web components you may find that they sometimes render to their light dom, for example to meet some accessibility requirements. We don't want to ignore the tag completely, as we would then not be able to test if we did render the tag. We can ignore just it's light dom:

```javascript
import getDiffableHTML from '@open-wc/semantic-dom-diff';

const leftTree = getDiffableHTML(`
  <div>
    <my-custom-input id="myInput">
      <input id="inputRenderedInLightDom">
      Some text rendered in the light dom
    </my-custom-input>
    foo
  </div>
`, { ignoreLightDom: ['my-custom-element'] });

const rightTree = getDiffableHTML(`
  <div>
    <my-custom-input id="myInput"></my-custom-input>
    foo
  </div>
`);

// this test will pass, the light dom of my-custom-input is ignored, but we can still test
// to see if the tag is placed properly
expect(leftTree).to.equal(rightTree);
```

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/semantic-dom-diff/README.md';
      }
    }
  }
</script>
