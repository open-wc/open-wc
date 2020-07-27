---
permalink: 'mdjs/index.html'
title: Markdown JavaScript (mdjs) Format
section: guides
tags:
  - guides
---

# Markdown JavaScript (mdjs) Format

Mdjs is a format that allows you to use JavaScript with Markdown, to create interactive demos. It does so by "annotating" JavaScript that should be executed in Markdown.

To annotate we use a code block with `js script`.

````md
```js script
// execute me
```
````

## Web Components

One very good use case for that can be web components.
HTML already works in markdown so all you need is to load a web components definition file.

You could even do so within the same markdown file.

````md
## This is my-card

Here's an example of the component:

```html preview-story
<my-card>
  <h2>Hello world!</h2>
  <button>Click me!</button>
</my-card>
```
````

You can even execute some JavaScript:

````md
## This is my-el

<my-el></my-el>

```js script
import { LitElement, html } from 'https://unpkg.com/lit-element?module';

class MyEl extends LitElement {
  render() {
    this.innerHTML = '<p style="color: red">I am alive</p>';
  }
}

customElements.define('my-el', MyEl);
```
````

## Demo Support (Story)

mdjs comes with some additional helpers you can choose to import via

````md
```js script
import '@mdjs/mdjs-story/mdjs-story.js';
import '@mdjs/mdjs-preview/mdjs-preview.js';
```
````

once loaded you can use them like so.

````md
```js script
import '@mdjs/mdjs-story/mdjs-story.js';
import '@mdjs/mdjs-preview/mdjs-preview.js';
```
````

once loaded you can use them like so.

### story

The code snippet will actually get executed at that place and you will have a live demo

````md
```js story
export const JsStory = () => html` <demo-wc-card>JS Story</demo-wc-card> `;
```
````

````md
```html story
<demo-wc-card>HTML Story</demo-wc-card>
```
````

#### full code support

````md
```js story
export const JsStory = () => {
  const calculateSomething = 12;
  return html`
    <demo-wc-card .header=${`Something: ${calculateSomething}`}>JS Story</demo-wc-card>
  `;
};
```
````

### preview story

Will become a live demo wrapped in a container with a show code button.

````md
```js preview-story
export const JsPreviewStory = () => html` <demo-wc-card>JS Preview Story</demo-wc-card> `;
```
````

````md
```html preview-story
<demo-wc-card>HTML Preview Story</demo-wc-card>
```
````

Here is a live example from [demo-wc-card](https://www.npmjs.com/package/demo-wc-card).

```js script
import '@mdjs/mdjs-story/mdjs-story.js';
import '@mdjs/mdjs-preview/mdjs-preview.js';
import { html } from 'lit-html';
```

```js preview-story
import 'demo-wc-card/demo-wc-card.js';
export const header = () => {
  return html` <demo-wc-card .header=${'my new header'}></demo-wc-card> `;
};
```

## Supported Systems

### es-dev-server

Preview your mdjs readme with live demos and auto reload.

- Add to your `package.json`:

  ```json
  "scripts": {
    "start": "es-dev-server",
  }
  ```

- Create a `es-dev-server.config.js` in the root of your repo.

  ```js
  const { mdjsTransformer } = require('@mdjs/core');

  module.exports = {
    nodeResolve: true,
    open: 'README.md',
    watch: true,
    responseTransformers: [mdjsTransformer],
  };
  ```

### Storybook

Please check out [@open-wc/demoing-storybook](https://open-wc.org/demoing/) for a fully integrated setup.

It includes [storybook-addon-markdown-docs](https://open-wc.org/demoing/storybook-addon-markdown-docs.html) which uses mdjs under the hood.

### Chrome Extension (currently only for Github)

See live demos directly inside github page, markdown files, issues, pull requests...

Please check out [mdjs-viewer](https://github.com/open-wc/mdjs-viewer).

## Build mdjs

### Basic

mdjs offers two more "basic" integrations

#### `mdjsDocPage`

Creates a full blown html page by passing in the markdown.

```js
const { mdjsDocPage } = require('@mdjs/core');

const page = await mdjsDocPage(markdownString);
/*
<html>
  ... // load styles/components for mdjs, start stories
  <body>
    <h1>Some Markdown</h1>
  </body>
</html>
*/
```

#### `mdjsProcess`

Pass in multiple markdown documents and you get back all the jsCode and rendered html.

```js
const { mdjsProcess } = require('@mdjs/core');

const data = await mdjsProcess(markdownString);
console.log(data);
/*
{
  jsCode: "
    import '@mdjs/mdjs-story/mdjs-story.js';
    ...
  ",
  html: '<h1>Markdown One</h1>',
}
*/
```

### Advanced

mdjs is build to be integrated within the [unifiedjs](https://unifiedjs.com/) system.

```js
const unified = require('unified');
const markdown = require('remark-parse');
const htmlStringify = require('remark-html');
const mdjsParse = require('@mdjs/core');

const parser = unified().use(markdown).use(mdjsParse).use(htmlStringify);
const result = await parser.process(body);
const { jsCode } = result.data;
console.log(result.contents);
// <h1>This is my-el></h1>
// <my-el></my-el>
console.log(jsCode);
// customElements.define('my-el', class extends HTMLElement {
// ...
```
