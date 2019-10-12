# Rollup

[//]: # (AUTO INSERT HEADER PREPUBLISH)

## Configuration
Rollup configuration to help you get started building modern web applications. You write modern javascript using the latest browser features, rollup will optimize your code for production ensure it runs on all supported browsers.

The input for rollup is the same `index.html` you use for development. Any module scripts in your index are run through rollup and your index is updated with the output from rollup.

- See the [config features section](#config-features) for full details
- See the [extending section](#extending-the-rollup-config) for more customization, such as supporting non-standard syntax or adding babel plugins.

## Setup

### New project
```bash
npm init @open-wc
```

### Existing project
```bash
npm init @open-wc
# Upgrade > Building > Rollup
```

### Manual setup

1. Install the required dependencies:
```bash
npm i -D @open-wc/building-rollup rollup rimraf es-dev-server
```

2. Create a `rollup.config.js` file and pass in your app's `index.html`:
```javascript
import { createDefaultConfig } from '@open-wc/building-rollup';

// if you need to support IE11 use `createCompatibilityConfig` instead.
// import { createCompatibilityConfig } from '@open-wc/building-rollup';
// export default createCompatibilityConfig({ input: './index.html' });

export default createDefaultConfig({ input: './index.html' });
```

3. Create an `index.html`:
```html
<!doctype html>
<html>
  <head></head>
  <body>
    <my-app></my-app>

    <script type="module" src="./src/my-app.js"></script>
  </body>
</html>
```

We use [rollup-plugin-index-html](https://open-wc.org/building/rollup-plugin-index-html.html) which takes your `index.html` as input for rollup. It scans for any `<script type="module" src="...">` and sends them to rollup for bundling, and outputs your `index.html` in the output directory.

4. Add the following commands to your `package.json`:
```json
{
  "scripts": {
    "build": "rimraf dist && rollup -c rollup.config.js",
    "start:build": "es-dev-server --app-index dist/index.html --open"
  }
}
```
- `start` runs your app for development, reloading on file changes
- `start:build` runs your app after it has been built using the build command
- `build` builds your app and outputs it in your `dist` directory

## Supporting legacy browsers
`createDefaultConfig` works for browsers which [support es modules](https://caniuse.com/#feat=es6-module). If you need to support older browsers such as IE11 you need to use our `createCompatibilityConfig` in your `rollup.config.js`:

```javascript
import { createCompatibilityConfig } from '@open-wc/building-rollup';

export default createCompatibilityConfig({ input: './index.html' });
```

In addition to outputting a regular build of your app, it outputs a legacy build which is compatible with older browsers down to IE11.

At runtime we determine which version of your app should be loaded, so that legacy browsers don't force you to ship more and slower code to most users on modern browsers.

## Config features
`createDefaultConfig`:
- compatible with browsers which [support es modules](https://caniuse.com/#feat=es6-module)
- babel transform based on browser support (no es5 for all browsers)
- load polyfills when needed:
  - dynamic import
  - webcomponents
- resolve bare imports ( `import { html } from 'lit-html'` )
- preserve `import.meta.url` value from before bundling
- minify + treeshake js
- minify html and css in template literals

`createCompatibilityConfig`:
- Two build outputs:
  - Modern build:
    - es modules
    - compatible with browsers which [support es modules](https://caniuse.com/#feat=es6-module)
    - babel transform based on browser support (no es5 for all browsers)

  - Legacy build:
    - systemjs modules
    - compatible down to IE11
    - babel transform down to IE11 (es5)
    - core js polyfills (`Promise`, `Symbol`, `String.prototype.includes` etc.)

  - Both:
    - resolve bare imports ( `import { html } from 'lit-html'` )
    - preserve `import.meta.url` value from before bundling
    - load polyfills when needed:
      - dynamic import
      - webcomponents
      - fetch
    - minify + treeshake js
    - minify html and css in template literals

## Adjusting browser support for the modern build
The legacy build targets IE11, which is the earliest browser supported by the webcomponents polyfill. For the modern build we target the lates 2 versions of the major browsers (chrome, firefox, safari and edge).

You can adjust this by adding a [browserslist](https://github.com/browserslist/browserslist) configuration. For example by adding a `.browserslistrc` file to your project, or adding an entry to your package.json. See the [browserslist documentation](https://github.com/browserslist/browserslist) for more information.

> Warning: you should not add IE11 or other very early browsers as a target in your browserslist, as it would result in a broken modern build because it makes some assumptions around browser support. Use the `--legacy` flag for legacy builds.

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

## Extending the rollup config
A rollup config is just a plain object. It's easy to extend it using javascript:
```javascript
import { createDefaultConfig } from '@open-wc/building-rollup';

const config = createDefaultConfig({ input: './index.html' });

export default {
  ...config,
  output: {
    ...config.output,
    sourcemap: false,
  },
  plugins: [
    ...config.plugins,
    myAwesomePlugin(),
  ],
};
```

If you use `createCompatibilityConfig`, it is actually an array of configs so that rollup outputs a modern and a legacy build. Simply `map` over the array to adjust both configs:

```javascript
import { createCompatibilityConfig } from '@open-wc/building-rollup';

const configs = createCompatibilityConfig({ input: './index.html' });

export default configs.map(config => ({
  ...config,
  output: {
    ...config.output,
    sourcemap: false,
  },
  plugins: [
    ...config.plugins,
    myAwesomePlugin(),
  ],
}));
```

### Common extensions
::: warning
Some extensions or plugins add non-native or experimental features to your code. This can be bad for the maintenance of your code in the long term, we therefore don't recommend it unless you know what you're doing.
:::

#### Customizing index.html output
If you need to customize the output of your `index.html` you can pass extra options to [rollup-plugin-index-html](https://open-wc.org/building/rollup-plugin-index-html.html):

```javascript
import { createDefaultConfig } from '@open-wc/building-rollup';
import { indexHTMLPlugin } from '@open-wc/rollup-plugin-index-html';
import deepmerge from 'deepmerge';

const basicConfig = createDefaultConfig({
  input: './index.html',
  plugins: [
    indexHTML: false
  ]
});

export default merge(basicConfig, {
  plugins: [
    indexHTMLPlugin({
      polyfills: {
        fetch: false,
        intersectionObserver: true,
      }
    }),
  ]
})
```

See the plugin docs for all options.

#### non index.html entrypoint
By default we look for an `index.html` as entrypoint. If want to use regular entrypoints you will need to provide your `index.html` for output manually:

```javascript
import { createDefaultConfig } from '@open-wc/building-rollup';
import { indexHTMLPlugin } from '@open-wc/rollup-plugin-index-html';
import deepmerge from 'deepmerge';

const basicConfig = createDefaultConfig({
  input: './my-app.js',
  plugins: [
    indexHTML: false
  ]
});

export default merge(basicConfig, {
  plugins: [
    indexHTMLPlugin({
      indexHTML: `
        <html>
          <head></head>
          <body></body>
        </html>
      `,

      // from file
      indexHTML: fs.readFileSync('/path/to/index.html', 'utf-8'),

      // other options:
      polyfills: {
        dynamicImport: true,
        webcomponents: true,
      }
    })
  ]
})

```

#### Resolve commonjs modules
CommonJS is the module format for NodeJS, and not suitable for the browser. Rollup only handles es modules by default, but sometimes it's necessary to be able to import a dependency. To do this, you can add [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs):

```javascript
import { createCompatibilityConfig } from '@open-wc/building-rollup';
import commonjs from 'rollup-plugin-commonjs';

const configs = createCompatibilityConfig({ input: './index.html' });

// map if you use an array of configs, otherwise just extend the config
export default configs.map(config => ({
  ...config,
  plugins: [
    ...config.plugins,
    commonjs(),
  ],
}));
```

### Copy assets
Web apps often include assets such as CSS files and images. These are not part of your regular dependency graph (see above), so they need to be copied into the build directory. Other files you might need to copy this way are e.g. fonts, JSON files, sound or video files, and HTML files (other than the `index.html` referenced in the `input` option) etc.

[Rollup-plugin-cpy](https://github.com/shrynx/rollup-plugin-cpy) is a plugin that can be used, but there are other options, too.

```javascript
import cpy from 'rollup-plugin-cpy';
import { createCompatibilityConfig } from '@open-wc/building-rollup';

const config = createCompatibilityConfig({
  input: './index.html',
});

// if you use an array of configs, you don't need the copy task to be executed for both builds.
// we can add the plugin only to the first rollup config:
export default [
  // add plugin to the first config
  {
    ...config[0],
    plugins: [
      ...config[0].plugins,
      cpy({
        // copy over all images files
        files: ['**/*.png'],
        dest: 'dist',
        options: {
          // parents makes sure to preserve the original folder structure
          parents: true
        }
      }),
    ],
  },

  // leave the second config untouched
  config[1],
];
```

### Support typescript
To import a typescript file, use the `.ts` extension in your `index.html`:

```html
<html>
<head></head>
<body>
  <my-app></my-app>
  <script type="module" src="./src/my-app.ts"></script>
</body>
</html>
```

Make sure you set your `tsconfig.json` `target` and `module` fields to `ESNext`. This way `tsc`, the typescript compiler, won't do any compilation so that a plugin can take care of it.

Within rollup there are two options to add typescript support.

#### 1. Babel
We recommend using the babel typescript plugin. Add it to your babel config file (`.babelrc` or `babel.config.js`):
```json
{
  "presets": [
    "@babel/preset-typescript"
  ],
}
```
You also need to specify `.ts` in the `extensions` option, for babel and node to properly recognize ts files:
```
const configs = createDefaultConfig({
  input: './index.html',
  extensions: ['.js', '.mjs', '.ts'],
});
```
(keep `.js` in there, since node will want to resolve javascript files in node_modules)

This is the fastest method, as it strips away types during babel transformation of your code. It will not perform any type checking though. We recommend setting up the type checking as part of your linting setup, so that you don't need to run the typechecker during development for faster builds.

#### 2. Plugin
It is also possible to add the rollup typescript plugin, which does typechecking and compiling for you:
```javascript
import typescript from 'rollup-plugin-typescript2';
import { createCompatibilityConfig } from '@open-wc/building-rollup';

const configs = createCompatibilityConfig({
  input: './index.html',
});

export default configs.map(config => ({
  ...config,
  plugins: [
    ...config.plugins,
    typescript(),
  ],
}));
```

#### Disable typescript compilation
We already mentioned this above, but this is *really important*: Make sure to prevent any compilation done by the typescript compiler (`tsc`). If you use one of the options above, you put babel or rollup in charge of the compilation of typescript. In no case do you want multiple compilers to interfere with each other.

You can do this by setting the following options in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
  }
}
```

#### Import CSS files in lit-html
To separate your lit-html styles in css files, you can use [rollup-plugin-lit-css](https://github.com/bennypowers/rollup-plugin-lit-css):

```javascript
import { createCompatibilityConfig } from '@open-wc/building-rollup';
import litcss from 'rollup-plugin-lit-css';

const configs = createCompatibilityConfig({ input: './index.html' });

// map if you use an array of configs, otherwise just extend the config
export default configs.map(config => ({
  ...config,
  plugins: [
    ...config.plugins,
    litcss({ include, exclude, uglify })
  ],
}));
```

## Progressive Web App

### Enabling the service worker

This configuration will by default generate a service worker for you, using [rollup-plugin-workbox](https://www.npmjs.com/package/rollup-plugin-workbox). The service worker will only be generated for production. To opt-in to using this service worker, you can add the following code snippet to your `index.html`:

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

If you want to override the default config with your own workbox configuration, you can disable the default workbox configuration by setting `options.plugins.workbox` to false in the `options` object that you pass to  `createBasicConfig`, and then you can override the plugins 

```js
const { createBasicConfig } = require('@open-wc/building-rollup');
const deepmerge = require('deepmerge');
const workbox = require('rollup-plugin-workbox');

const basicConfig = createBasicConfig({ 
  input: './index.html',
  plugins: {
    workbox: false,
  }
});

export default merge(basicConfig, {
  plugins: [
    workbox({
      mode: 'injectManifest',
      workboxConfig: require('./workbox-config.js')
    }),
  ]
});
```

`workbox-config.js`:
```js
const path = require('path');

module.exports = {
    swDest: path.join(__dirname, 'dist', 'sw.js'),
    swSrc: path.join(__dirname, 'serviceWorker.js'),
    globDirectory: path.join(__dirname, 'dist'),
    globPatterns: ['**/*.{html,js,css}'],
}
```

You can find the options for configuring Workbox [here](https://developers.google.com/web/tools/workbox/modules/workbox-build).

### Disabling service worker generation

To opt out of using workbox to generate a service worker, you can disabled it by overriding the options in the `createBasicConfig` function:

```js
export default createBasicConfig({
    input: './index.html', 
    plugins: {
        workbox: false
    } 
});
```

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/building-rollup/README.md';
      }
    }
  }
</script>
