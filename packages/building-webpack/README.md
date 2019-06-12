# Webpack

[//]: # (AUTO INSERT HEADER PREPUBLISH)

## Configuration
Our webpack configuration will help you get started using webpack. You can write modern javascript and use the latest browser features, webpack will optimize your code for production and do the necessary transforms and polyfills for older browsers.

As input you specify your `index.html`, any module scripts are run through webpack and your index is updated with the correct code and polyfills to run application.

See 'config features' for all details. See the extending section for customization, such as supporting non-standard syntax or adding babel plugins.

## Setup

```bash
npm init @open-wc
# Upgrade > Building > Webpack
```

## Manual setup

1. Install the required dependencies:
```bash
npm i -D @open-wc/building-webpack webpack webpack-cli webpack-dev-server http-server
```

2. Create a file called `webpack.config.js` and pass in your app's js entry point and index.html. Pick the config you need below:

```javascript
const path = require('path');
const createDefaultConfig = require('@open-wc/building-webpack/modern-config');

// if you need to support IE11 use "modern-and-legacy-config" instead.
// const createDefaultConfig = require('@open-wc/building-webpack/modern-and-legacy-config');

module.exports = createDefaultConfig({
  input: path.resolve(__dirname, './index.html'),
});
```

3. Create an `index.html`:
```html
<!doctype html>
<html>
  <head></head>
  <body>
    <your-app></your-app>

    <script type="module" src="./src/your-app.js"></script>
  </body>
</html>
```

We use [webpack-index-html-plugin](https://open-wc.org/building/webpack-index-html-plugin.html). Contrary to other webpack plugins, you **do** need to include your app's module entrypoint in your `index.html`. This allows you to use the same index during development and when building.

4. Add the following commands to your `package.json`:
```json
{
  "scripts": {
    "build": "webpack --mode production",
    "start": "webpack-dev-server --mode development --open",
    "start:build": "http-server dist -o"
  }
}
```
- `build` builds your app and outputs it in your `dist` directory
- `start` builds and runs your app, rebuilding on file changes
- `start:build` runs your built app from `dist` directory, it uses a simple http-server to make sure that it runs without magic

## Browser support
`modern-config.js` creates a single build of your app for modern browsers (by default last 2 of major browsers). This is recommended if you only need to support modern browsers, otherwise you will need to ship compatibility code for browsers which don't need it.

`modern-and-legacy-config.js` creates two builds of your app. A modern build like the above, and a legacy build for IE11. Additional code is injected to load polyfills and the correct version of your app. This is recommended if you need to support IE11.

## Config features
All configs:
- resolve bare imports (`import { html } from 'lit-html'`)
- preserve `import.meta.url` value from before bundling
- minify + treeshake js
- minify html and css in template literals

`modern-config.js`:
- single build output
- compatible with any browser which supports Web Components

`modern-and-legacy-config.js`:
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
  "plugins": [
    "@babel/plugin-proposal-class-properties"
  ]
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
const createDefaultConfig = require('@open-wc/building-webpack/modern-config');

const config = createDefaultConfig({
  input: path.resolve(__dirname, './index.html'),
});

module.exports = merge(config, {
  output: {
    path: 'build'
  },
});
```

If you use `modern-and-legacy-config.js`, it is actually an array of configs so that webpack outputs a modern and a legacy build. Simply map over the array to adjust both configs:

```javascript
const merge = require('webpack-merge');
const createDefaultConfigs = require('@open-wc/building-webpack/modern-and-legacy-config');

const configs = createDefaultConfigs({
  input: path.resolve(__dirname, './index.html'),
});

module.exports = configs.map(config => merge(config, {
  output: {
    path: 'build'
  },
}));
```

## Common extensions
::: warning
Some extensions add non-native syntax to your code, which can be bad for maintenance longer term. We suggest avoiding adding plugins for using experimental javascript proposals or for importing non-standard module types.
:::

## Customizing index.html output
If you need to customize the output of your `index.html` you can pass extra options to [webpack-index-html-plugin](https://open-wc.org/building/webpack-index-html-plugin.html):

```javascript
const merge = require('webpack-merge');
const createDefaultConfig = require('@open-wc/building-webpack/modern-config');

module.exports = createDefaultConfig({
  input: path.resolve(__dirname, './index.html'),
  webpackIndexHTMLPlugin: {
    template: ({ assets, entries, legacyEntries, variation }) => `
      <html>
        <head></head>
        <body>
          ... custom index html template ...
        </body>
      </html>
    `,
  },
});
```

See the documentation for all options.

## Adding or removing polyfills
By default we polyfill `core-js`, `webcomponentsjs` and `fetch`. It is possile to add or remove polyfills by passing `webpack-index-html` configuration like above:

```javascript
const merge = require('webpack-merge');
const createDefaultConfig = require('@open-wc/building-webpack/modern-config');

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

[See the documentation](https://open-wc.org/building/webpack-index-html-plugin.html) for more information.

### Copy assets
Web apps often include assets such as css files and images. These are not part of your regular dependency graph, so they need to be copied into the build directory.

[copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin) is a popular plugin fo this.

```javascript
const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const createDefaultConfigs = require('@open-wc/building-webpack/modern-and-legacy-config');

const configs = createDefaultConfigs({
  input: path.resolve(__dirname, './index.html'),
});

// with modern-and-legacy-config, the config is actually an array of configs for a modern and
// a legacy build. We don't need to copy files twice, so we aadd the copy job only to the first
// config
module.exports = [
  // add plugin to the first config
  merge(configs[0], {
    plugins: [
      new CopyWebpackPlugin([
        'images/**/*.png',
      ]),
    ],
  }),

  // the second config left untouched
  configs[1],
];
```

### Support typescript
Make sure to prevent any compilation done by the typescript compiler `tsconfig.json`, as babel and webpack do this for you:

```json
{
  "compilerOptions": {
    "target": "ESNEXT",
    "module": "ESNext",
  }
}
```

Within webpack there are two options to add typescript support.

#### 1. Babel
We recommend using the babel typescript plugin. Add this to your `.babelrc`:
```json
{
  "presets": [
    "@babel/preset-typescript"
  ],
}
```

This the fastest method, as it strips away types during babel transformormation of your code. It will not perform any type checking though. We recommend setting up the type checking as part of your linting setup, so that you don't need to run the typechecker during development for faster builds.


<details>
  <summary>Supporting decorators</summary>

  ::: warning
  Please note that decorators will add [non standard syntax](https://open-wc.org/building/building-webpack.html#common-extensions) to your code.
  :::

  > Due to the way Babel handles [decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators) and class properties, you'll need to specify the plugins in a specific order with specific options. Here's what you'll need:
  ```javascript
  {
    "presets": ["@babel/preset-typescript"],
    "plugins": [
      ["@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": true }],
      "@babel/plugin-proposal-class-properties"
    ]
  }

  ```
</details>

#### 2. Plugin
It is also possible to add the webpack typescript plugin, which does typechecking and compiling for you:

```javascript
const path = require('path');
const merge = require('webpack-merge');
const createDefaultConfigs = require('@open-wc/building-webpack/modern-and-legacy-config');

const configs = createDefaultConfigs({
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

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/building-webpack/README.md';
      }
    }
  }
</script>
