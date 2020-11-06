---
permalink: 'demoing/index.html'
title: Demoing
section: guides
tags:
  - guides
---

# Demoing via storybook

For demoing, documenting and showcasing different states of your Web Component, we recommend using [storybook](https://storybook.js.org/).

<div class="custom-block warning"><p class="custom-block-title">NOTICE</p> <p>`@open-wc/demoing-storybook` is currently configured to work with Storybook v5. However you write your stories, be sure that you use syntax compatible with v5 to best prepare your project for success. If you are interested in working with Storybook v6, follow along to development of the next generation of <a href="https://github.com/modernweb-dev/storybook-prebuilt" target="_blank" rel="noopener noreferrer">Storybook Prebuilt<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg></a>.</p></div>

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Features

- Create API documentation/playground
- Use Storybook docs mode to showcase your elements within the normal text flow
- Works down to IE11
- Prebuilt storybook UI (for a fast startup)
- Uses es-dev-server (serve modern code while developing)
- Completely separate storybook UI from your code

NOTE: some code processing often attributed to the Storybook webpack build (e.g. the use of `*.css` or `*.svg` files directly in JS or the inline processing of Typescipt) will by default not be included herein. One option here is to ensure that you code is "browser ready" when loading it into Storybook. Alternatively, checkout the [full documentation](https://github.com/open-wc/es-dev-server) for es-dev-server for information on other options around supporting these processes.

## Demo

<div class="custom-block tip"><p class="custom-block-title">TIP</p> <p>Don't take our word for it but look at <a href="https://open-wc.org/demoing-storybook/?path=/docs/demo-card-docs--simple" target="_blank" rel="noopener noreferrer">the documentation of a demo card<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg></a> and <a href="https://open-wc.org/demoing-storybook/?path=/docs/decorators-withwebcomponentknobs--example-output" target="_blank" rel="noopener noreferrer">the documentation of the knobs decorator<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg></a>.</p></div>

## Setup

```bash
npm init @open-wc
# Upgrade > Demoing
```

When looking to have the Storybook configuration files added to you project, be sure that you actively highlight `◉ Demoing (storybook)` (with the <kdb>Spacebar</kbd> or <kbd>right arrow key</kbd>) in response to "Would you like to scaffold examples files for?" to ensure that those files are added to your project.

### Manual

- `yarn add @open-wc/demoing-storybook --dev`
- Copy at minimum the [.storybook](https://github.com/open-wc/open-wc/tree/master/packages/create/src/generators/demoing-storybook/templates/static/.storybook) folder to `.storybook`
- If you want to bring along the examples, you may also copy the `stories` folder.
- Be sure you have a [custom-elements.json](#custom-elementsjson) file.
- Add the following scripts to your package.json

```json
"scripts": {
  "storybook": "start-storybook --node-resolve --watch --open",
  "storybook:build": "build-storybook"
},
```

## Usage

```bash
npm run storybook
```

### CLI configuration

#### Dev server

The storybook server is based on [es-dev-server](https://open-wc.org/developing/es-dev-server.html) and accepts the same command line args. Check the docs for all available options.

#### Storybook specific

| name       | type   | description                                                   |
| ---------- | ------ | ------------------------------------------------------------- |
| config-dir | string | Where the storybook config files are. Default: `./.storybook` |
| output-dir | string | Rollup build output directory. Default: `./static-storybook`  |

### Configuration file

By default, storybook looks for a config file called `main.js` in your config dir (default `.storybook`). In this file you can configure storybook itself, `es-dev-server` and the `rollup` build configuration.

```js
module.exports = {
  // Globs of all the stories in your project
  stories: ['../stories/*.stories.{js,mdx}'],

  // Addons to be loaded, note that you need to import
  // them from storybook-prebuilt
  addons: [
    'storybook-prebuilt/addon-actions/register.js',
    'storybook-prebuilt/addon-knobs/register.js',
    'storybook-prebuilt/addon-a11y/register.js',
    'storybook-prebuilt/addon-docs/register.js',
  ],

  // Configuration for es-dev-server (start-storybook only)
  esDevServer: {
    nodeResolve: true,
    open: true,
  },

  // Rollup build output directory (build-storybook only)
  outputDir: '../dist',
  // Configuration for rollup (build-storybook only)
  rollup: config => {
    return config;
  },
};
```

### Create documentation (mdjs)

Create a `*.stories.md` (for example `card.stories.md`) file within the `stories` folder.

This uses the [Markdown JavaScript (mdjs) Format](https://open-wc.org/docs/experimental/mdjs/) via [storybook-addon-markdown-docs](https://github.com/open-wc/legacy/tree/master/packages/storybook-addon-web-components-knobs).

````md
```js script
import '../demo-wc-card.js';

export default {
  title: 'Demo Card/Docs (markdown)',
  parameters: { component: 'demo-wc-card' },
};
```

# Demo Web Component Card

A component meant to display small information with additional data on the back.
// [...] use markdown to format your text
// the following demo is inline

```js story
export const Simple = () => html` <demo-wc-card>Hello World</demo-wc-card> `;
```

## Variations

Show demo with a frame and a "show code" button.

```js preview-story
export const Simple = () => html` <demo-wc-card>Hello World</demo-wc-card> `;
```

## API

The api table will show the data of "demo-wc-card" in your `custom-elements.json`.

<sb-props of="demo-wc-card"></sb-props>

// [...]
````

### Create documentation (mdx)

Create a `*.stories.mdx` (for example `card.stories.mdx`) file within the `stories` folder.

```md
import { Story, Preview, Meta, Props } from '@open-wc/demoing-storybook';
import { html } from 'lit-html';
import '../demo-wc-card.js';

<Meta title="Card|Docs" />

# Demo Web Component Card

A component meant to display small information with additional data on the back.
// [...] use markdown to format your text

<Preview withToolbar>
  <Story name="Simple" height="220px">
    {html`
      <demo-wc-card>Hello World</demo-wc-card>
    `}
  </Story>
</Preview>

## API

The api table will show the data of "demo-wc-card" in your `custom-elements.json`.

<Props of="demo-wc-card" />

// [...]
```

### Create stories in CSF (Component story format)

Create a `*.stories.js` (for example `card-variations.stories.js`) file within the `stories` folder.

```js
export default {
  title: 'Card|Variations',
  component: 'demo-wc-card',
};

export const singleComponent = () => html` <demo-wc-card></demo-wc-card> `;
```

For more details see the [official storybook docs](https://storybook.js.org/docs/formats/component-story-format/).

You can import these templates into any other place if needed.

For example in tests:

```js
import { expect, fixture } from '@open-wc/testing';
import { singleComponent } from '../stories/card-variations.stories.js';

it('has a header', async () => {
  const el = await fixture(singleComponent);
  expect(el.header).to.equal('Your Message');
});
```

### Create API playground

<div class="custom-block tip"><p class="custom-block-title">TIP</p> <p>You can find a more interactive version of this in the <a href="/demoing-storybook/?path=/docs/decorators-withwebcomponentknobs--example-output">withWebComponentsKnobs docs</a>.</p></div>

Based on the data in [custom-elements.json](./#custom-elementsjson), we can automatically generate knobs for your stories.

To enable this feature you will need to add an additional decorator.

**MDX**

```md
import { withKnobs, withWebComponentsKnobs } from '@open-wc/demoing-storybook';

<Meta
  title="WithWebComponentsKnobs|Docs"
  decorators={[withKnobs, withWebComponentsKnobs]}
  parameters={{ component: 'demo-wc-card', options: { selectedPanel: 'storybookjs/knobs/panel' } }}
/>

<Story name="Custom Header" height="220px">
  {html`
    <demo-wc-card header="Harry Potter">A character that is part of a book series...</demo-wc-card>
  `}
</Story>
```

**CSF**

```js
import { html } from 'lit-html';
import { withKnobs, withWebComponentsKnobs } from '@open-wc/demoing-storybook';

import '../demo-wc-card.js';

export default {
  title: 'Card|Playground',
  component: 'demo-wc-card',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: { options: { selectedPanel: 'storybookjs/knobs/panel' } },
};

export const singleComponent = () => html` <demo-wc-card></demo-wc-card> `;
```

For additional features like

- define which components to show knobs for
- showing knobs for multiple different components
- syncing components states to knobs
- Filtering properties and debugging states

please see the official [documentation of the knobs for web components decorator](/demoing-storybook/?path=/docs/decorators-withwebcomponentknobs--example-output).

### custom-elements.json

In order to get documentation for web-components you will need to have a [custom-elements.json](https://github.com/webcomponents/custom-elementsjson) file.
You can handwrite it or better generate it. Depending on the web components sugar you are choosing your mileage may vary.
Please note that the details of the file are still being discussed so we may adopt to changes in `custom-elements.json` without a breaking release.

Known analyzers that output `custom-elements.json`:

- [web-component-analyzer](https://github.com/runem/web-component-analyzer)
  - Supports LitElement, Polymer, Vanilla, (Stencil)
- [stenciljs](https://stenciljs.com/)
  - Supports Stencil (but does not have all metadata)

It basically looks like this:

```json
{
  "version": 2,
  "tags": [
    {
      "name": "demo-wc-card",
      "properties": [
        {
          "name": "header",
          "type": "String",
          "description": "Shown at the top of the card"
        }
      ],
      "events": [],
      "slots": [],
      "cssProperties": []
    }
  ]
}
```

For a full example see the [./demo/custom-elements.json](./demo/custom-elements.json).

<div class="custom-block tip"><p class="custom-block-title">TIP</p> <p>Storybook Knobs cannot deliver the value `undefined` to your stories. Custom element that register propertie with a default value of `undefined` will have those properties excluded from the list of knobs that are created for your story from the associated entry in your `custom-elements.json` file.</p></div>

### Additional middleware config like an api proxy

As we are using [es-dev-server](https://open-wc.org/developing/es-dev-server.html) under the hood you can use all it's power. You can use the regular command line flags, or provide your own config via `start storybook -c /path/to/config.js`.

To set up a proxy, you can set up a koa middleware. [Read more about koa here.](https://koajs.com/)

```javascript
const proxy = require('koa-proxies');

module.exports = {
  esDevServer: {
    port: 9000,
    middlewares: [
      proxy('/api', {
        target: 'http://localhost:9001',
      }),
    ],
  },
};
```
