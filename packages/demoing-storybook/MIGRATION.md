# Migration

- [Migration](#migration)
  - [From version 0.3.x to 0.4.x](#from-version-03x-to-04x)
    - [Storybook Upgrade from 5.1.x to 5.3.x](#storybook-upgrade-from-51x-to-53x)
    - [Dependency changes](#dependency-changes)
    - [Removed `default-storybook-webpack-config.js`](#removed-default-storybook-webpack-configjs)
    - [Replaced `withClassPropertiesKnobs` with a decorator `withWebComponentsKnobs`](#replaced-withclasspropertiesknobs-with-a-decorator-withwebcomponentsknobs)

If you did not modify your configurations then you can upgrade to the latest version by rerunning the generator.

```bash
npm init @open-wc
# Upgrade > Demoing
```

## From version 0.3.x to 0.4.x

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
