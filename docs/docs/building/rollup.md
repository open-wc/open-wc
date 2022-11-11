# Building >> Rollup ||20

Rollup configuration to help you get started building modern web applications.
You write modern javascript using the latest browser features, rollup will optimize your code for production and ensure it runs on all supported browsers.

## Features

- Set HTML or JS as input and/or output
- Optimized for browsers which support modules
- Optional separate build for legacy browsers
- Loads polyfills using feature detection
- Generates a service worker
- Minifies JS
- Minifies lit-html templates

## Automatic setup

We recommend the open-wc [project generator](https://open-wc.org/guides/developing-components/getting-started/) for automated setup, for new projects or to upgrade existing projects.

## Manual setup

Install the required dependencies:

<details>
<summary>View</summary>

```bash
npm i -D rollup @open-wc/building-rollup rimraf deepmerge es-dev-server
```

</details>

Create a `rollup.config.js` file:

<details>
<summary>View</summary>

```js
import merge from 'deepmerge';
// use createSpaConfig for bundling a Single Page App
import { createSpaConfig } from '@open-wc/building-rollup';

// use createBasicConfig to do regular JS to JS bundling
// import { createBasicConfig } from '@open-wc/building-rollup';

const baseConfig = createSpaConfig({
  // use the outputdir option to modify where files are output
  // outputDir: 'dist',

  // if you need to support older browsers, such as IE11, set the legacyBuild
  // option to generate an additional build just for this browser
  // legacyBuild: true,

  // development mode creates a non-minified build for debugging or development
  developmentMode: process.env.ROLLUP_WATCH === 'true',

  // set to true to inject the service worker registration into your index.html
  injectServiceWorker: false,
});

export default merge(baseConfig, {
  // if you use createSpaConfig, you can use your index.html as entrypoint,
  // any <script type="module"> inside will be bundled by rollup
  input: './index.html',

  // alternatively, you can use your JS as entrypoint for rollup and
  // optionally set a HTML template manually
  // input: './app.js',
});
```

</details>

Add the following NPM scripts to your `package.json`:

<details>
<summary>View</summary>

```json
{
  "scripts": {
    "build": "rimraf dist && rollup -c rollup.config.js",
    "start:build": "npm run build && es-dev-server --root-dir dist --app-index index.html --compatibility none --open"
  }
}
```

</details>

### SPA Projects

If you have a SPA (Single Page App) project you can use `createSpaConfig` to generate your config. This will inject the rollup output into a single index.html file, generate a service worker and load polyfills using feature detection.

#### HTML as input

You can set an index.html file as rollup input. Any modules inside will be bundled by rollup and the final output will be injected into the final HTML file.

<details>
<summary>View example</summary>

```js
import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';

const baseConfig = createBasicConfig();

export default merge(baseConfig, {
  input: './index.html',
});
```

</details>

#### Custom HTML template

You can also provide the HTML as a template, as a string or read from a file. See the [html plugin docs](https://github.com/open-wc/open-wc/tree/master/packages/rollup-plugin-html#readme) for all possible options.

<details>
<summary>View example</summary>

```js
import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';

const baseConfig = createBasicConfig({
  html: {
    template: /* your template goes here */,
  },
});

export default merge(baseConfig, {
  input: './src/app.js',
});
```

</details>

### Non-SPA projects

If you are not building a single page app you can use `createBasicConfig` to set up regular JS to JS bundling.

From there on it's easy to extend further for different use cases. For example, to bundle and generate multiple HTML files you can take a look at the documentation of [@web/rollup-plugin-html](https://modern-web.dev/docs/building/rollup-plugin-html/). See below how to add plugins to the rollup config.

## Injecting a service worker

When you use `createSpaConfig` a service worker is generated automatically with Workbox. The service worker registration is not injected into your `index.html` by default to prevent unexpected results. You can turn this on by enabling the `injectServiceWorker` option:

```js
const baseConfig = createSpaConfig({
  injectServiceWorker: true,
});
```

If you overwrite the workbox configuration and the `swDest` property of the workbox config, `injectServiceWorker` will automatically use the value of `swDest` in the service worker registration. Example:

```js
const baseConfig = createSpaConfig({
  injectServiceWorker: true,
  workbox: {
    swDest: './my-sw.js',
  },
});
```

Will result in:

```js
navigator.serviceWorker.register('./my-sw.js');
```

## Supporting older browsers

The default build output works only on browsers that support modules. If you need to support older browsers, such as IE11 or the old Edge, you can set the `legacyBuild` option when you use the create config function.

This will create a separate rollup build output for legacy browsers and makes sure the correct version is loaded. This has minimal impact on users with modern browsers.

```js
const baseConfig = createSpaConfig({
  legacyBuild: true,
});
```

## Customizations

Our config generator sets you up with good defaults for most projects. It's easy to extend and customize this config further for your requirements.

If you find yourself disabling a lot of the default functionality we recommend forking from the default config and taking control yourself. Rollup is relatively easy to configure compared to other build tools, it's better to be in full control if you know what you're doing.

### Customizing the babel config

You can define custom babel plugins to be loaded by adding a `.babelrc` or `babel.config.js` to your project. See [babeljs config](https://babeljs.io/docs/en/configuration) for more information.

For example to add support for class properties:

```json
{
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

### Customizing default plugins

Our config creators install a number of rollup plugins by default:

Basic and SPA config plugins:

- [nodeResolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve#readme)
- [babel](https://github.com/rollup/plugins/tree/master/packages/babel#readme)
- [terser](https://github.com/TrySound/rollup-plugin-terser#readme)

SPA config plugins:

- [html](https://github.com/open-wc/open-wc/tree/master/packages/rollup-plugin-html#readme)
- [polyfillsLoader](https://github.com/open-wc/open-wc/tree/master/packages/polyfills-loader#readme)
- [workbox](https://www.npmjs.com/package/rollup-plugin-workbox)

You can customize options for these plugins, or turn them off completely by setting them to false. Check the documentation for the respective plugins to learn which options can be configured.

<details>
<summary>View example</summary>

Each plugin can be either "true", "false" or an object. If it's an object, this is used as a configuration for the plugin.

```js
const baseConfig = createSpaConfig({
  nodeResolve: { browser: true, dedupe: ['lit-html'] },
  babel: true,
  terser: { exclude: ['node_modules*'] },
  html: false,
  polyfillsLoader: false,
  workbox: false,
});
```

</details>

Examples:

### Customize HTML

[@web/rollup-plugin-html](https://modern-web.dev/docs/building/rollup-plugin-html/) powers a lot of what our rollup config does. It has a lot of options available, for example, to transform the HTML output or set a different template.

We recommend looking into the documentation to get an overview of all available options.

<details>
<summary>View example</summary>

```js
import packageJson from './package.json';

const baseConfig = createSpaConfig({
  html: {
    transform: [
      // inject lang attribute
      html => html.replace('<html>', '<html lang="en-GB">'),
      // inject app version
      html =>
        html.replace(
          '</body>',
          `<script>window.APP_VERSION = "${packageJson.version}"</script></body>`,
        ),
    ],
  },
});
```

</details>

### Customize polyfills

[@open-wc/rollup-plugin-polyills-loader](https://github.com/open-wc/open-wc/tree/master/packages/rollup-plugin-polyfills-loader#readme) loads polyfills only when necessary based on feature detection.

You can prevent certain polyfills from being loaded or add your own polyfills.

<details>
<summary>View example</summary>

```js
const baseConfig = createSpaConfig({
  polyfillsLoader: {
    polyfills: {
      webcomponents: false,
      intersectionObserver: true,
      resizeObserver: true,
      custom: [
        {
          name: 'my-feature-polyfill',
          path: require.resolve('my-feature-polyfill'),
          test: "!('myFeature' in window)",
          minify: true,
        },
      ],
    },
  },
});
```

</details>

### Customize built-in babel plugins

We add some babel plugins by default. These can be overwritten with a different configuration from the config. For example to change the html template minification, or add other modules to be minified:

<details>
  <summary>View example</summary>

```js
const baseConfig = createSpaConfig({
  babel: {
    plugins: [
      [
        require.resolve('babel-plugin-template-html-minifier'),
        {
          modules: {
            'cool-html': ['html'],
          },
          htmlMinifier: {
            removeComments: false,
          },
        },
      ],
    ],
  },
});
```

</details>

## Extending the rollup config

A rollup config is just a plain object. It's easy to extend it using javascript. We recommend using the `deepmerge` library because it is an easy way to merge objects and arrays:

<details>
<summary>View example</summary>

```javascript
import merge from 'deepmerge';
import { createSpaConfig } from '@open-wc/building-rollup';

const baseConfig = createSpaConfig();

export default merge(baseConfig, {
  // add your own rollup configuration here
  input: './index.html',
  output: {
    sourcemap: false,
  },
  plugins: [
    // add new plugins
    myPlugin(),
  ],
});
```

</details>

If you have enabled the legacy build option, the `output` option is an array. In that case, you cannot use deepmerge if you need to make changes to the `output` option.

<details>
<summary>View example</summary>

```javascript
import merge from 'deepmerge';
import { createSpaConfig } from '@open-wc/building-rollup';

const baseConfig = createSpaConfig({
  legacyBuild: true,
});

// set the sourcemap option on both outputs
baseConfig.output[0].sourcemap = true;
baseConfig.output[1].sourcemap = true;

export default merge(baseConfig, {
  input: './index.html',
  plugins: [
    // add new plugins
    myPlugin(),
  ],
});
```

</details>

#### Copying assets

To copy over assets, such as images, css or json files, we recommend using [rollup-plugin-copy](https://www.npmjs.com/package/rollup-plugin-copy)

<details>
  <summary>View example</summary>

```js
import merge from 'deepmerge';
import { createSpaConfig } from '@open-wc/building-rollup';
import copy from 'rollup-plugin-copy';

const baseConfig = createSpaConfig();

export default merge(baseConfig, {
  input: './index.html',
  plugins: [
    copy({
      targets: [{ src: 'assets/**/*', dest: './dist' }],
      // set flatten to false to preserve folder structure
      flatten: false,
    }),
  ],
});
```

</details>

#### Support for CommonJs modules

Rollup only supports standard es modules (using `import` and `export`). A lot of projects don't use this syntax yet, and instead use the CommonJs module format. This format uses `require` and `module.exports` statements, and is intended for NodeJs.

To support this in Rollup, you can add the [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) plugin.

<details>
  <summary>View example</summary>

```js
import merge from 'deepmerge';
import { createSpaConfig } from '@open-wc/building-rollup';
import commonjs from '@rollup/plugin-commonjs';

const baseConfig = createSpaConfig();

export default merge(baseConfig, {
  input: './index.html',
  plugins: [commonjs()],
});
```

</details>

#### Support for Typescript

<details>

<summary>View example</summary>

To support Typescript in rollup you have multiple options. You can run `tsc`, and then run rollup on the generated JS files. This is useful when you are already running `tsc` for use in other tools, such as a dev server. You can also use the [@rollup/plugin-typescript](https://github.com/rollup/plugins/tree/master/packages/typescript) plugin to integrate with rollup more directly. View their documentation for more information.

```js
import merge from 'deepmerge';
import { createSpaConfig } from '@open-wc/building-rollup';
import typescript from '@rollup/plugin-typescript';

const baseConfig = createSpaConfig();

export default merge(baseConfig, {
  input: './index.html',
  plugins: [typescript()],
});
```

</details>
