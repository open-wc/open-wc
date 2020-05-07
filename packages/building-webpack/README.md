# Webpack

Webpack configuration to help you get started building modern web applications. You write modern javascript using the latest browser features, webpack will optimize your code for production ensure it runs on all supported browsers.

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

## Configuration

The input for webpack is the same `index.html` you use for development. Any module scripts in your index are run through webpack and your index is updated with the output from rollup.

See 'config features' for all details. See the extending section for customization, such as supporting non-standard syntax or adding babel plugins.

## Setup

### New project

```bash
npm init @open-wc
```

### Existing project

```bash
npm init @open-wc
# Upgrade > Building > Webpack
```

### Manual setup

1. Install the required dependencies:

```bash
npm i -D @open-wc/building-webpack webpack webpack-cli es-dev-server
```

2. Create a file called `webpack.config.js` and pass in your app's js entry point and index.html. Pick the config you need below:

```javascript
const path = require('path');
const { createDefaultConfig } = require('@open-wc/building-webpack');

// if you need to support IE11 use `createCompatibilityConfig` instead.
// const { createCompatibilityConfig } = require('@open-wc/building-webpack');
// module.exports = createCompatibilityConfig({
//   input: path.resolve(__dirname, './index.html'),
// });

module.exports = createDefaultConfig({
  input: path.resolve(__dirname, './index.html'),
});
```

3. Create an `index.html`:

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <your-app></your-app>

    <script type="module" src="./src/your-app.js"></script>
  </body>
</html>
```

We use [webpack-index-html-plugin](https://github.com/open-wc/open-wc/tree/master/packages/webpack-index-html-plugin). Contrary to other webpack plugins, you **do** need to include your app's module entrypoint in your `index.html`. This allows you to use the same index during development and when building.

4. Add the following commands to your `package.json`:

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "start:build": "es-dev-server --app-index dist/index.html --open"
  }
}
```

- `start` runs your app for development, reloading on file changes
- `start:build` runs your app after it has been built using the build command
- `build` builds your app and outputs it in your `dist` directory

## Browser support

`createDefaultConfig` creates a single build of your app for modern browsers (by default last 2 of major browsers). This is recommended if you only need to support modern browsers, otherwise you will need to ship compatibility code for browsers which don't need it.

`createCompatibilityConfig` creates two builds of your app. A modern build like the above, and a legacy build for IE11. Additional code is injected to load polyfills and the correct version of your app. This is recommended if you need to support IE11.

## Config features

All configs:

- resolve bare imports (`import { html } from 'lit-html'`)
- preserve `import.meta.url` value from before bundling
- minify + treeshake js
- minify html and css in template literals

`createDefaultConfig`:

- single build output
- compatible with any browser which supports Web Components

`createCompatibilityConfig`:

- Two build outputs:
  - Modern:
    - compatible with modern browsers (default: last 2 chrome, firefox safari and edge)
    - does not penalize users with modern browser with compatibility code for IE11
  - Legacy:
    - compatible down to IE11
    - babel transform down to IE11 (es5)
    - core js babel polyfills (`Array.from`, `String.prototype.includes` etc.)
    - webcomponentsjs polyfills
    - URL polyfill
    - fetch polyfill

See below for more configuration options.

## Customizing the babel config

You can define your own babel plugins by adding a `.babelrc` or `babel.config.js` to your project. See [babeljs config](https://babeljs.io/docs/en/configuration) for more information.

For example to add support for class properties:

```json
{
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

## Adjusting browser support for the modern build

The legacy build targets IE11, which is the earliest browser supported by the webcomponents polyfill. For the modern build we target the lates 2 versions of the major browsers (chrome, firefox, safari and edge).

You can adjust this by adding a [browserslist](https://github.com/browserslist/browserslist) configuration. For example by adding a `.browserslistrc` file to your project, or adding an entry to your package.json. See the [browserslist documentation](https://github.com/browserslist/browserslist) for more information.

> Note: you should not add IE11 or other very early browsers as a target in your browserslist, as it would result in a broken modern build because it makes some assumptions around browser support. Use the `--legacy` flag for legacy builds.

## Extending the webpack config

A webpack config is an object. To extend it, we recommend using `webpack-merge` to ensure plugins are merged correctly. For example to adjust the output folder:

```javascript
const merge = require('webpack-merge');
const { createDefaultConfig } = require('@open-wc/building-webpack');

const config = createDefaultConfig({
  input: path.resolve(__dirname, './index.html'),
});

module.exports = merge(config, {
  output: {
    path: 'build',
  },
});
```

If you use `createCompatibilityConfig`, it is actually an array of configs so that webpack outputs a modern and a legacy build. Simply map over the array to adjust both configs:

```javascript
const merge = require('webpack-merge');
const { createCompatibilityConfig } = require('@open-wc/building-webpack');

const configs = createCompatibilityConfig({
  input: path.resolve(__dirname, './index.html'),
});

module.exports = configs.map(config =>
  merge(config, {
    output: {
      path: 'build',
    },
  }),
);
```

### Common extensions

::: warning
Some extensions or plugins add non-native or experimental features to your code. This can be bad for the maintenance of your code in the long term, we therefore don't recommend it unless you know what you're doing.
:::

#### Customizing index.html output

If you need to customize the output of your `index.html` you can pass extra options to [webpack-index-html-plugin](https://github.com/open-wc/open-wc/tree/master/packages/webpack-index-html-plugin):

```javascript
const merge = require('webpack-merge');
const { createDefaultConfig } = require('@open-wc/building-webpack');

module.exports = createDefaultConfig({
  input: path.resolve(__dirname, './index.html'),
  webpackIndexHTMLPlugin: {
    polyfills: {
      fetch: false,
      intersectionObserver: true,
    },
  },
});
```

See the documentation for all options.

#### non index.html entrypoint

By default we look for an `index.html` as entrypoint. If want to use regular entrypoints you will need to provide your `index.html` for output manually:

```javascript
const merge = require('webpack-merge');
const { createDefaultConfig } = require('@open-wc/building-webpack');

module.exports = createDefaultConfig({
  input: path.resolve(__dirname, './my-app.js'),
  webpackIndexHTMLPlugin: {
    template: ({ assets, entries, legacyEntries, variation }) => `
      <html>
        <head></head>
        <body></body>
      </html>
    `,
  },
});
```

#### Adding or removing polyfills

By default we polyfill `core-js`, `webcomponentsjs` and `fetch`. It is possile to add or remove polyfills by passing `webpack-index-html` configuration like above:

```javascript
const merge = require('webpack-merge');
const { createDefaultConfig } = require('@open-wc/building-webpack');

module.exports = createDefaultConfig({
  input: path.resolve(__dirname, './index.html'),
  webpackIndexHTMLPlugin: {
    polyfills: {
      fetch: false,
      intersectionObserver: true,
      customPolyfills: [
        {
          name: 'my-feature',
          test: "'myFeature' in window",
          path: require.resolve('my-feature-polyfill/dist/bundled.js'),
        },
      ],
    },
  },
});
```

[See the documentation](https://github.com/open-wc/open-wc/tree/master/packages/webpack-index-html-plugin) for more information.

#### Copy assets

Web apps often include assets such as css files and images. These are not part of your regular dependency graph, so they need to be copied into the build directory.

[copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin) is a popular plugin fo this.

```javascript
const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { createCompatibilityConfig } = require('@open-wc/building-webpack');

const configs = createCompatibilityConfig({
  input: path.resolve(__dirname, './index.html'),
});

// with modern-and-legacy-config, the config is actually an array of configs for a modern and
// a legacy build. We don't need to copy files twice, so we aadd the copy job only to the first
// config
module.exports = [
  // add plugin to the first config
  merge(configs[0], {
    plugins: [new CopyWebpackPlugin(['images/**/*.png'])],
  }),

  // the second config left untouched
  configs[1],
];
```

#### Support typescript

Make sure to prevent any compilation done by the typescript compiler `tsconfig.json`, as babel and webpack do this for you:

```json
{
  "compilerOptions": {
    "target": "ESNEXT",
    "module": "ESNext"
  }
}
```

Within webpack there are two options to add typescript support.

##### 1. Babel

We recommend using the babel typescript plugin. Add this to your `.babelrc`:

```json
{
  "presets": ["@babel/preset-typescript"]
}
```

This the fastest method, as it strips away types during babel transformormation of your code. It will not perform any type checking though. We recommend setting up the type checking as part of your linting setup, so that you don't need to run the typechecker during development for faster builds.

<details>
  <summary>Supporting decorators</summary>

::: warning
Please note that decorators will add [non standard syntax](#common-extensions) to your code.
:::

```json
{
  "presets": ["@babel/preset-typescript"],
  // for libraries that support babel decorators (lit-element) use:
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": true }],
    "@babel/plugin-proposal-class-properties"
  ]
  // for libraries that only support typescript:
  // "plugins": [
  //   ["@babel/plugin-proposal-decorators", { "legacy": true }],
  //   ["@babel/plugin-proposal-class-properties", { "loose": true }]
  // ],
}
```

</details>

##### 2. Plugin

It is also possible to add the webpack typescript plugin, which does typechecking and compiling for you:

```javascript
const path = require('path');
const merge = require('webpack-merge');
const { createCompatibilityConfig } = require('@open-wc/building-webpack');

const configs = createCompatibilityConfig({
  input: path.resolve(__dirname, './index.html'),
});

module.exports = configs.map(config =>
  merge(config, {
    module: {
      rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
    },
  }),
);
```

## Progressive Web App

### Making your app installable

Make sure your PWA meets the installable criteria, which you can find [here](https://developers.google.com/web/fundamentals/app-install-banners/). You can find a tool to generate your `manifest.json` [here](https://www.pwabuilder.com/generate). When your app has a service worker with a `fetch` handler (generated by this configuration), a `manifest.json`, and is served over HTTPS, your app is ready to be installed.

### Enabling the service worker

This configuration will by default generate a service worker for you, using [workbox-webpack-plugin](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin). The service worker will only be generated for production. To opt-in to using this service worker, you can add the following code snippet to your `index.html`:

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js');
    });
  }
</script>
```

### Overriding the workbox config

If you want to override the default config with your own workbox configuration, you can disable the default workbox configuration by setting `options.plugins.workbox` to false in the `options` object that you pass to `createBasicConfig`, and then you can override the plugins

```js
const merge = require('deepmerge');
const { InjectManifest } = require('workbox-webpack-plugin');
const createDefaultConfig = require('@open-wc/building-webpack');

const defaultConfig = createDefaultConfig({
  plugins: {
    workbox: false,
  },
});

module.exports = merge(defaultConfig, {
  plugins: [new InjectManifest(/* */)],
});
```

You can find the options for configuring Workbox [here](https://developers.google.com/web/tools/workbox/modules/workbox-build).

### Disabling service worker generation

To opt out of using workbox to generate a service worker, you can disabled it by overriding the options in the `createBasicConfig` function:

```js
module.exports = createBasicConfig({
  plugins: {
    workbox: false,
  },
});
```

### A note on `skipWaiting`

By default, the service worker generated will _not_ call `skipWaiting`. The reason for this is that it becomes very painful very quickly if you're lazyloading code in your application.

If you want to add a user-friendly 'Add To Home Screen' experience, you can use the [pwa-update-available](https://github.com/thepassle/pwa-helpers) web component.
