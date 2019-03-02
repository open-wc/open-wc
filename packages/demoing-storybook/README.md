# Demoing via storybook

[//]: # (AUTO INSERT HEADER PREPUBLISH)

For demoing and showcasing different states of your Web Component, we recommend using [storybook](https://storybook.js.org/).

::: tip
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

# Features
- Create API documentation/playground
- Show documentation (from markdown) with your element
- Show your source code to copy/paste
- Helper to setup transpilation for dependencies
- Setup that works down to IE11


## Setup
```bash
npm init open-wc demoing
```

### Manual
- `yarn add @open-wc/demoing-storybook --dev`
- Copy at minimum the [.storybook](https://github.com/daKmoR/create-open-wc/tree/master/src/generators/demoing-storybook/templates/static/.storybook) folder to `.storybook`
- If you want to bring along the examples, you may also copy the `stories` folder.
- Add the following scripts to your package.json
```js
"scripts": {
  "storybook": "start-storybook -p 9001",
  "storybook:build": "build-storybook -o _site",
  "site:build": "npm run storybook:build",
},
```

## Usage

Create stories within the `stories` folder.

```bash
npm run storybook
```

### Create a Story

Create an `*.story.js` (for example `index.stories.js`) file within the `stories` folder.

```js
import {
  storiesOf,
  html,
} from '@open-wc/demoing-storybook';

storiesOf('Demo|Example Element', module)
  .add(
    'Alternative Header',
    () => html`
      <my-el .header=${'Something else'}></my-el>
    `,
  );
```

### Create API documentation/playground

If you have a single element then we can fully generate a usable api documentation/playground.
The data will be read from the elements properties.
So this should probably be your default story to gives users documentation, api and playground all in one.
For additional edge cases you should add more stories.

Note: you need to provide the Class (not a node or a template)

```js
import { storiesOf, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

storiesOf('Demo|Example Element', module)
  .addDecorator(withKnobs)
  .add(
    'Documentation',
    () => withClassPropertiesKnobs(MyEl),
    { notes: { markdown: notes } },
  )
```

So with a configuration like this you will get this auto generated.

<img src="https://raw.githubusercontent.com/open-wc/open-wc/master/packages/demoing-storybook/dev_assets/storybook.gif" alt="storybook demo animation" />


For most types this works fine out of the box but if want to provide better knobs you can do so by overriding.
```js
() => withClassPropertiesKnobs(MyEl, {
  overrides: el => [
    // show a color selector
    { key: 'headerColor', fn: () => color('headerColor', el.headerColor, 'Element') },
    // show dropdown
    {
      key: 'type',
      fn: () => select('type', ['small', 'medium', 'large'], el.type, 'Element'),
    },
    // show textarea where you can input json
    { key: 'complexItems', fn: () => object('complexItems', el.complexItems, 'Inherited') },
    // move property to a different group
    { key: 'locked', group: 'Security' },
  ],
}),
```

By default it will create one simple node from the given Class.
However for a nicer demo it may be needed to set properties or add more lightdom.
You can do so by providing a template.
```js
() => withClassPropertiesKnobs(MyEl, {
  template: html`
    <my-el .header=${'override it'}><p>foo</p></my-el>
  `,
}),
```

### Show documentation (from markdown) with your element

The documentation will be visible when clicking on "notes" at the top menu.

```js
import notes from '../README.md';

.add(
  'Documentation',
  () => html`
    <my-el></my-el>
  `,
  { notes: { markdown: notes } },
)
```

### Helper to setup transpilation for dependencies

Whenever you add a dependency that is written in ES modules you will need to enable transpilation for it.
Open your configuration and add the new package to the array.
Below you see the default settings.

```js
const defaultConfig = require('@open-wc/demoing-storybook/default-storybook-webpack-config.js');

module.exports = ({ config }) => {
  return defaultConfig({ config, transpilePackages: ['lit-html', 'lit-element', '@open-wc'] });
};
```

### Additional middleware config like a proxy
If you need additional configuration for the storybook dev server you can provide them via a config file `.storybook/middleware.js`.
```js
// example for a proxy middleware to use an api for fetching data to display
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api/', {
    target: 'http://localhost:9010/',
  }));
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
