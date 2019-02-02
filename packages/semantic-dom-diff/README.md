# Semantic Dom Diff

[//]: # (AUTO INSERT HEADER PREPUBLISH)

## Manual Setup
```bash
yarn add @open-wc/semantic-dom-diff --dev
```

## Basics

```javascript
import { getSemanticDomDiff } from '@open-wc/semantic-dom-diff';

const leftTree = `
  <div>foo</div>
`;
const rightTree = `
  <div>bar</div>
`;

// Diff will be an object if there is a difference, otherwise undefined
const diff = getSemanticDomDiff(leftTree, rightTree);
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
