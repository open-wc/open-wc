# Markdown JavaScript (mdjs) Format

The format is meant to allow using JavaScript with Markdown.
It does so by "annotating" JavaScript that should be execute in Markdown.

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

mdjs comes with some additional helpers like

### js story

The code snippet will actually get executed at that place and you will have a live demo

````md
```js story
export const JsStory = () =>
  html`
    <demo-wc-card>JS Story</demo-wc-card>
  `;
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

### js preview story

Will become a live demo wrapped in a container with a show code button.

````md
```js preview-story
export const JsStory = () =>
  html`
    <demo-wc-card>JS Story</demo-wc-card>
  `;
```
````

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

const parser = unified()
  .use(markdown)
  .use(mdjsParse)
  .use(htmlStringify);
const result = await parser.process(body);
const { jsCode } = result.data;
console.log(result.contents);
// <h1>This is my-el></h1>
// <my-el></my-el>
console.log(jsCode);
// customElements.define('my-el', class extends HTMLElement {
// ...
```

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/mdjs/README.md';
      }
    }
  }
</script>
