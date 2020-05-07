```js script
import { html } from 'lit-html';
import '@mdjs/mdjs-story/mdjs-story.js';
import '@mdjs/mdjs-preview/mdjs-preview.js';
import './demo-wc-card.js';
```

# Heading 1

Foo is great

- looks like a game card
- content in the front
- data in the back

## How to use

```bash
yarn add @foo/demo-wc-card
```

```js
import '@foo/demo-wc-card/demo-wc-card.js';
```

## Js Story

```js story
export const JsStory = () => html` <demo-wc-card>JS Story</demo-wc-card> `;
```

## Js Preview Story

with preview

```js preview-story
export const JsStory2 = () => html` <demo-wc-card>JS Story with preview</demo-wc-card> `;
```

## Html Story

```html story
<demo-wc-card></demo-wc-card>
```

## Html Preview Story

with preview

```html preview-story
<demo-wc-card></demo-wc-card>
```
