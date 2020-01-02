# Migration

- [Migration](#migration)
  - [From version 0.4.x to 1.0.0](#from-version-04x-to-100)
    - [Config/Webpack changes](#configwebpack-changes)
  - [From version 0.3.x to 0.4.0](#from-version-03x-to-040)
    - [Storybook Upgrade from 5.1.x to 5.3.x](#storybook-upgrade-from-51x-to-53x)
    - [Dependency changes](#dependency-changes)
    - [Removed default-storybook-webpack-config.js](#removed-default-storybook-webpack-configjs)
    - [Replaced withClassPropertiesKnobs with a decorator withWebComponentsKnobs](#replaced-withclasspropertiesknobs-with-a-decorator-withwebcomponentsknobs)

If you did not modify your configurations then you can upgrade to the latest version by rerunning the generator.

```bash
npm init @open-wc
# Upgrade > Demoing
```

## From version 0.4.x to 1.0.0

With 1.0.0 we replaced the storybook default webpack setup with:

- Prebuilt storybook UI (for a fast startup)
- Uses es-dev-server (serve modern code while developing)
- Completely separate storybook UI from your code

This means if you want to use custom plugins that you have to prebuilt your own version of storybook.

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

Note that [@storybook/addon-storysource](https://github.com/storybookjs/storybook/tree/next/addons/storysource) is NOT part of this prebuilt.
It is a feature that only worked with webpack and as of now there is no replacement available.
However the code snippet feature of mdx stories still works as expected.
Furthermore with mdx it may make more sense to show hand crafted code snippets to the user.

### Config/Webpack changes

The configuration files in `.storybook` will need to be adjusted

If you used any webpack features/plugins within your story this will be no longer supported.
Most likely you will need to rewrite the functionality via an [es-dev-server middleware](https://open-wc.org/developing/es-dev-server.html#custom-middlewares-proxy)

- `config.js` got renamed to `preview.js`
- delete `addons.js`, `presets.js`, `webpack.config.js` as they no longer have any effect as storybook UI is prebuilt. If you want to use custom plugins or presets then you will need to prebuilt your own version of storybook
- delete `middleware.js` and replace it with an [es-dev-server middleware](https://open-wc.org/developing/es-dev-server.html#custom-middlewares-proxy)

**Changes to `preview.js`**

- The webpack specific `require.context` function which was used to define which stories to load has been replaced with a command line argument
- The webpack specific `module.hot` reload has been replaced by es-dev-server default reload mode

Remove the following code from you `preview.js`.

```js
// force full reload to not reregister web components
const req = require.context('../some/path/to/stories', true, /\.stories\.(js|mdx)$/);
configure(req, module);
if (module.hot) {
  module.hot.accept(req.id, () => {
    const currentLocationHref = window.location.href;
    window.history.pushState(null, null, currentLocationHref);
    window.location.reload();
  });
}
```

If you had a custom `require.context` which is different to the default `./stories/\*.stories.{js,mdx}` then adjust your `package.json` scripts

```json
"scripts": {
  "storybook": "start-storybook --stories \"some/path/to/stories/*.stories.{js,mdx}\" --node-resolve --watch --open",
  "storybook:build": "build-storybook --stories \"some/path/to/stories/*.stories.{js,mdx}\""
},
```

## From version 0.3.x to 0.4.0

### Storybook Upgrade from 5.1.x to 5.3.x

Be sure to check the [official storybook migration guide](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md).
You will need to look at:

- [From version 5.1.x to 5.2.x](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#from-version-51x-to-52x)
- [From version 5.2.x to 5.3.x](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#from-version-52x-to-53x)

With the introduction of storybook docs mode we generally recommend writing documentation and stories in one go in an `*.stories.mdx` file.

Alternatively we recommend writing stories in CSF (Components Story Format) as it allows to reuse those stories in for example tests.

If you want to convert from a `storiesOf` syntax there is codemod available in the [Storybook CLI](https://github.com/storybookjs/storybook/tree/next/lib/cli).

```bash
sb migrate storiesof-to-csf --glob "**/*.stories.js"
```

For more details please see to the [official announcement](https://medium.com/storybookjs/component-story-format-66f4c32366df).

### Dependency changes

We switched from `@storybook/polymer` to `@storybook/web-components`.
Officially we never supported html imports but `polymer-webpack-loader` get still loaded by storybook.
But not anymore.

We removed `@storybook/addons` as a default dependency so if you still need it be sure to add it to your local dependency.

### Removed `default-storybook-webpack-config.js`

With `@storybook/web-components` most dependencies get transpiled automatically.
Therefore we no longer need to export a helper for it.
Also you can delete your `.storybook/.babelrc`.
If you did not manually add any extra packages to transpile you can delete your `.storybook/webpack.config.js`.

If you have a specific library like `my-library` that needs to be transpiled you can add it like so:

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

### Replaced `withClassPropertiesKnobs` with a decorator `withWebComponentsKnobs`

We now recommend to put all meta data for your web-components in to a special meta data file called [custom-elements.json](https://github.com/webcomponents/custom-elements-json).
Using this file we can generate knobs by applying a decorator.
Note that all extra settings for `withClassPropertiesKnobs` will need to be move into the `custom-elements.json` file.

```js
// old
import { storiesOf, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';
storiesOf('Demo|Example Element', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(MyEl), {
    options: { selectedPanel: 'storybooks/knobs/panel' },
  });

// new
import { withKnobs, withWebComponentsKnobs } from '@open-wc/demoing-storybook';
export default {
  title: 'MyEl|Playground',
  component: 'my-el',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: { options: { selectedPanel: 'storybookjs/knobs/panel' } },
};

export const singleComponent = () => html`
  <my-el></my-el>
`;
// + setup in .storybook/config.js
import { setCustomElements } from '@open-wc/demoing-storybook';
import customElements from '../custom-elements.json';

setCustomElements(customElements);
```
