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
