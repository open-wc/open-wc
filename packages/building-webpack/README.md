# Webpack

[//]: # (AUTO INSERT HEADER PREPUBLISH)

## Configuration
Our webpack configuration will help you get started using webpack. Our configuration lets you write code using modern javascript syntax and features, providing the necessary syntax transformation and polyfills for older browsers.

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

2. Create a file called `webpack.config.js` and pass in your app's js entry point and index.html.

If you don't need to support IE11 or other legacy browsers, use `@open-wc/building-webpack/modern-config`. Otherwise, use `@open-wc/building-webpack/modern-and-legacy-config`.
```javascript
const path = require('path');
const createDefaultConfig = require('@open-wc/building-webpack/modern-and-legacy-config');

// If you don't need IE11 support, use the modern-config instead
// import createDefaultConfig from '@open-wc/building-webpack/modern-config';

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

We use [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) to work with your index.html. View the documentation for the plugin to learn how you can use it.

Remember to not add your app's entry point to your index.html, as it will be injected dynamically by `html-webpack-plugin`.

4. Create a `.browserslistrc` in the root of your project. Adjust it based on your browser support, for example:
```
last 2 Chrome major versions
last 2 ChromeAndroid major versions
last 2 Edge major versions
last 2 Firefox major versions
last 2 Safari major versions
last 2 iOS major versions
```

Do **not** put IE11 in your `.browserslistrc`. `modern-and-legacy-config` already creates a separate build for IE11, the `.browserslistrc` is used for the modern build.

5. Add the following commands to your `package.json`:
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
`modern-config.js` creates a single build of your app, based on your `.browserslistrc`. This is recommended if you only need to support modern browsers, otherwise you will need to ship compatibility code for browsers which don't need it.

`modern-and-legacy-config.js` creates two builds of your app. A modern build based on your `.browserslistrc` and a legacy build for IE11. Additional code is injected to load polyfills and the correct version of your app. This is recommended if you need to support IE11.

## Config features
All configs:
- compilation target based on `.browserslistrc`
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
    - compilation target based on `.browserslistrc`
    - does not penalize users with modern browser with compatibility code for IE11
  - Legacy:
    - compatible down to IE11
    - babel transform down to IE11 (es5)
    - core js babel polyfills (`Array.from`, `String.prototype.includes` etc.)
    - URL polyfill
    - webcomponentsjs polyfills

See 'extending' to add more configuration.

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

### Common extensions
::: warning
Some extensions add non-native syntax to your code, which can be bad for maintenance longer term. We suggest avoiding adding plugins for using experimental javascript proposals or for importing non-standard module types.
:::

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
