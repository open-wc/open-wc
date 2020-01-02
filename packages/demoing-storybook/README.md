# Demoing via storybook

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

For demoing, documenting and showcasing different states of your Web Component, we recommend using [storybook](https://storybook.js.org/).

::: tip
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

# Features

- Create API documentation/playground
- Use Storybook docs mode to showcase your elements within the normal text flow
- Works down to IE11
- Prebuilt storybook UI (for a fast startup)
- Uses es-dev-server (serve modern code while developing)
- Completely separate storybook UI from your code

**Prebuilt Storybook comes with**

- [@storybook/web-components](https://github.com/storybookjs/storybook/tree/next/app/web-components)
- [@storybook/addon-a11y](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [@storybook/addon-actions](https://github.com/storybookjs/storybook/tree/next/addons/actions)
- [@storybook/addon-backgrounds](https://github.com/storybookjs/storybook/tree/next/addons/backgrounds)
- [@storybook/addon-console](https://github.com/storybookjs/storybook-addon-console)
- [@storybook/addon-docs](https://github.com/storybookjs/storybook/tree/next/addons/docs)
- [@storybook/addon-links](https://github.com/storybookjs/storybook/tree/next/addons/links)
- [@storybook/addon-knobs](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [@storybook/addon-viewport](https://github.com/storybookjs/storybook/tree/next/addons/viewport)
- storybook-addon-web-components-knobs

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
- Copy at minimum the [.storybook](https://github.com/open-wc/open-wc/tree/master/packages/create/src/generators/demoing-storybook/templates/static/.storybook) folder to `.storybook`
- If you want to bring along the examples, you may also copy the `stories` folder.
- Be sure you have a [custom-elements.json](#custom-elements-json) file.
- Add the following scripts to your package.json

```json
"scripts": {
  "storybook": "start-storybook --node-resolve --watch --open",
  "storybook:build": "build-storybook"
},
```

### Migration

If you are already using `@open-wc/storybook` be sure to check out the [Migration Guide](/demoing/MIGRATION.md).

## Usage

Create documentation/stories within the `stories` folder.

```bash
npm run storybook
```

### CLI configuration

#### Storybook specific

| name         | type   | description                                                                                                    |
| ------------ | ------ | -------------------------------------------------------------------------------------------------------------- |
| stories      | string | A glob which stories to include. Be sure to wrap it in `'`. Default: `'./stories/\*.stories.{js,mdx}'`         |
| config-dir   | string | Where the storybook config files are. Default: ./.storybook                                                    |
| manager-path | string | Where to load the prebuilt manager from. This is passed to `require.resolve`, it can be a file path or import. |
| preview-path | string | Where to load the prebuilt preview from. This is passed to `require.resolve`, it can be a file path or import. |
|              |        | Build only                                                                                                     |
| output-dir   | string | Rollup build output directory. Default: ./static-storybook                                                     |

#### Dev server

The storybook server is based on [es-dev-server](https://open-wc.org/developing/es-dev-server.html), see the docs of the dev server for any additional command options.

### Configuration file

By default, `@open-wc/demoing-storybook` looks for config files called `start-storybook.config.js` and `build-storybook.config.js` in your config dir (default `.storybook`). You can modify this by using the `--config` or `-c` flag.

For `start-storybook`, the config file contains the options specific to storybook and the options for `es-dev-server`. The options are camelCased versions of the CLI args. Example:

```js
module.exports = {
  stories: './stories/*.stories.{js,mdx}',
  managerPath: './my-manager.js',
  nodeResolve: true,
  open: true,
};
```

### Create documentation

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

### Additional middleware config like an api proxy

As we are using [es-dev-server](https://open-wc.org/developing/es-dev-server.html) under the hood you can use all it's power. You can use the regular command line flags, or provide your own config via `start storybook -c /path/to/config.js`.

To set up a proxy, you can set up a koa middleware. [Read more about koa here.](https://koajs.com/)

```javascript
const proxy = require('koa-proxies');

module.exports = {
  port: 9000,
  middlewares: [
    proxy('/api', {
      target: 'http://localhost:9001',
    }),
  ],
};
```

### Custom storybook build

We use a custom storybook build so that we can load it as an es module in the browser, and we don't need to wait for webpack to build. You can provide your own custom storybook build with the `--manager-path` and `--preview-path` flags:

```bash
start-storybook --manager-path my-storybook-prebuild/dist/manager.js --preview-path my-storybook-/dist/preview.js
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
