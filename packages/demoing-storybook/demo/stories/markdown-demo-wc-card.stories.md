```js script
import { withWebComponentsKnobs, action, withKnobs, text, number, html } from '../../index.js';

import '../demo-wc-card.js';

export default {
  title: 'Demo Card/Docs (markdown)',
  parameters: { component: 'demo-wc-card', options: { selectedPanel: 'storybookjs/knobs/panel' } },
};
```

# Demo Web Component Card

A component meant to display small information with additional data on the back.

## Features:

- looks like a game card
- content in the front
- data in the back

## How to use

### Installation

```bash
yarn add @foo/demo-wc-card
```

```js
import '@foo/demo-wc-card/demo-wc-card.js';
```

```js preview-story
export const Simple = () => html`
  <demo-wc-card>Hello World</demo-wc-card>
`;
```

## API

<sb-props of="demo-wc-card"></sb-props>

## Playground

For each story you see here you have a menu point on the left.
Click on canvas and then knobs to see and modify the public api.

### Variations

###### Header

```js story
export const CustomHeader = () => html`
  <demo-wc-card header="Harry Potter">A character that is part of a book series...</demo-wc-card>
`;
```

###### Back Side

```js story
export const ShowBack = () => html`
  <demo-wc-card back-side>Hello World</demo-wc-card>
`;
```

###### Providing Rows

```js story
export const ProvideRows = () => {
  const rows = [
    { header: 'health', value: '200' },
    { header: 'mana', value: '100' },
  ];
  return html`
    <demo-wc-card back-side .rows=${rows}>
      A card with data on the back
    </demo-wc-card>
  `;
};
```
