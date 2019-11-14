# Demoing via storybook

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

For demoing, documenting and showcasing different states of your Web Component, we recommend using [storybook](https://storybook.js.org/).

::: tip
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

# Features

- Create API documentation/playground
- Use Storybook docs mode to showcase your elements within the normal text flow
- Show your source code to copy/paste
- Setup that works down to IE11

## Demo

::: tip
Don't take our word for it but look at [the documentation of a demo card](/demoing-storybook/?path=/docs/demo-card-docs--simple) and [the documentation of the knobs decorator](/demoing-storybook/?path=/docs/decorators-withwebcomponentknobs--example-output).
:::

## Setup

```bash
npm init @open-wc
# Upgrade > Demoing
```

### Manual

- `yarn add @open-wc/demoing-storybook --dev`
- Copy at minimum the [.storybook](https://github.com/open-wc/open-wc/blob/master/packages/create/src/generators/demoing-storybook/templates/static/.storybook/addons.js) folder to `.storybook`
- If you want to bring along the examples, you may also copy the `stories` folder.
- Be sure you have a [custom-elements.json](./#custom-elementsjson) file.
- Add the following scripts to your package.json

```js
"scripts": {
  "storybook": "start-storybook -p 9001",
  "storybook:build": "build-storybook -o _site -s storybook-static",
},
```

### Migration

If you are already using `@open-wc/storybook` be sure to check out the [Migration Guide](/demoing/MIGRATION.md).

## Usage

Create documentation/stories within the `stories` folder.

```bash
npm run storybook
```

### Create documentation

Create a `*.stories.mdx` (for example `card.stories.mdx`) file within the `stories` folder.

```md
import { Story, Preview, Meta, Props } from '@storybook/addon-docs/blocks';
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

export const singleComponent = () => html`
  <demo-wc-card></demo-wc-card>
`;
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

::: tip
You can find a more interactive version of this in the [withWebComponentsKnobs docs](/demoing-storybook/?path=/docs/decorators-withwebcomponentknobs--example-output).
:::

Base on the data in [custom-elements.json](./#custom-elementsjson) we can automatically generate knobs for your stories.

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

export const singleComponent = () => html`
  <demo-wc-card></demo-wc-card>
`;
```

For additional features like

- define which components to show knobs for
- showing knobs for multiple different components
- syncing components states to knobs
- Filtering properties and debugging states

please see the official [documentation of the knobs for web components decorator](/demoing-storybook/?path=/docs/decorators-withwebcomponentknobs--example-output).

### custom-elements.json

In order to get documentation for web-components you will need to have a [custom-elements.json](https://github.com/webcomponents/custom-elements-json) file.
You can hand write it or better generate it. Depending on the web components sugar you are choosing your mileage may vary.
Please not that the details of the file are still being discussed so we may adopt to changes in `custom-elements.json` without a breaking release.

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

# Setup es6/7 dependencies

By default storybook only works with precompiled es5 code but as most web components themselves and their libs are distributed as es7 you will need to manually mark those packages as "needs transpilation".

For example if you have a library called `my-library` which is in es7 then you can add it like so

```js
// .storybook/webpack.config.js

module.exports = ({ config }) => {
  // find web-components rule for extra transpilation
  const webComponentsRule = config.module.rules.find(
    rule => rule.use && rule.use.options && rule.use.options.babelrc === false,
  );
  // add your own `my-library`
  webComponentsRule.test.push(new RegExp(`node_modules(\\/|\\\\)my-library(.*)\\.js$`));

  return config;
};
```

By default the following folders are included

- `src/*.js`
- `packages/*/src/*.js`
- `node_modules/lit-html/*.js`
- `node_modules/lit-element/*.js`
- `node_modules/@open-wc/*.js`
- `node_modules/@polymer/*.js`
- `node_modules/@vaadin/*.js`

As you can see the `src` folder is also included.
The reason for that is as it has some extra configuration to allow for example `import.meta`.
If you use a different folder you will need to make sure webpack/babel can handle it.

### Additional middleware config like an api proxy

If you need additional configuration for the storybook dev server you can provide them via a config file `.storybook/middleware.js`.

```js
// example for a proxy middleware to use an api for fetching data to display
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/api/', {
      target: 'http://localhost:9010/',
    }),
  );
};
```

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/building-storybook/README.md';
      }
    }
  }
</script>
