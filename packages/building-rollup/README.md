# Rollup

[//]: # (AUTO INSERT HEADER PREPUBLISH)

## Configuration
We provide a rollup configuration to help you get started using rollup with web components and modules.

Our configuration lets you write code using modern javascript syntax and features, providing the necessary syntax transformation and polyfills for older browsers. See 'config features' for more details.

See the [extending section](#extending-the-rollup-config) for more customization, such as supporting non-standard syntax or adding babel plugins.

## Setup

```bash
npm init @open-wc
# Upgrade > Building > Rollup
```

## Manual setup

1. Install the required dependencies:
```bash
npm i -D @open-wc/building-rollup rollup rimraf owc-dev-server
```

2. Create a `rollup.config.js` file and pass in your app's `index.html`:
```javascript
import createDefaultConfig from '@open-wc/building-rollup/modern-config';

export default createDefaultConfig({ input: './index.html' });
```

Our rollup config will look through your `index.html` and extract all module scripts (nothing else -- see below) and feed them to rollup.

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

Note: Our rollup config will go through the `index.html` file, detect all *js files*, that are *loaded as a module*, put them in its dependency graph, and bundle them in the end. Anything else (e.g. CSS files, fonts, images, other js scripts, modules from inline scripts) will *not* be put in the dependency graph for you, even if it is referenced in the `index.html` file. You'll need to copy this to the output directory separately. See [copy assets](#copy-assets) below for details.

To illustrate this, here is an example of scripts which our rollup config will **not** handle automatically:
```html
  <script type="module">
    // this *is* a module, but it's inlined in the HTML, so
    // `my-app` will not be picked up by rollup and needs
    // to be copied separately
    import { MyApp } from './src/my-app';
  </script>

  <!--
    other-script.js is not inline, it is sourced, but as
    it is not type="module", it will still not be picked up
    by rollup and needs to be copied separately
  -->
  <script src="./src/other-script.js"></script>
```

4. Add the following commands to your `package.json`:
```json
{
  "scripts": {
    "start": "owc-dev-server --app-index index.html --open --watch",
    "start:build": "owc-dev-server dist/ --open",
    "build": "rimraf dist && rollup -c rollup.config.js"
  }
}
```
- `start` runs your app for development, reloading on file changes
- `start:build` runs your app after it has been built using the build command
- `build` builds your app and outputs it in your `dist` directory

## Supporting legacy browsers
The `modern-config.js` based config we setup above works for browsers which support dynamic imports (Chrome 63+, Safari 11.1+, Firefox 67+)

If you need to support older browsers or Edge and IE11 you use our `modern-and-legacy-config.js` in your `rollup.config.js`:

```javascript
import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';

export default createDefaultConfig({ input: './index.html' });
```

In addition to outputting your app as a module, it outputs a legacy build of your app and loads the appropriate version based on browser support. Depending on your app's own code, this will work on Chrome, Safari, Firefox, Edge and IE11.

## Config features
`modern-config.js`:
- compatible with (Chrome 63+, Safari 11.1+, Firefox 67+)
- babel transform based on browser support (no es5)
- output es modules using native dynamic import
- resolve bare imports ( `import { html } from 'lit-html'` )
- preserve `import.meta.url` value from before bundling
- minify + treeshake js
- minify html and css in template literals

`modern-and-legacy-config.js`:

**Modern build:**
- compatible with latest 2 versions of chrome, safari, firefox and edge
- babel transform based on browser support (no es5)
- es modules
- dynamic import polyfill

**Legacy build**
- compatible down to IE11
- babel transform down to IE11 (es5)
- core js babel polyfills (`Array.from`, `String.prototype.includes` etc.)
- systemjs modules

**Both**
- resolve bare imports ( `import { html } from 'lit-html'` )
- web component polyfills
- preserve `import.meta.url` value from before bundling
- minify + treeshake js
- minify html and css in template literals

## Config options
Our config accepts two options:

```javascript
export default createDefaultConfig({
  // your app's index.html. required
  input: './index.html',
  // the directory to output files into, defaults to 'dist'. optional
  outputDir: '',
});
```

See [extending](#extending-the-rollup-config) to add more configuration.

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

## Extending the rollup config
A rollup config is just a plain object. It's easy to extend it using javascript:
```javascript
import createDefaultConfig from '@open-wc/building-rollup/modern-config';

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

If you use `modern-and-legacy-config.js`, it is actually an array of configs so that rollup outputs a modern and a legacy build. Simply `map` over the array to adjust both configs:

```javascript
import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';

const configs = createDefaultConfig({ input: './index.html' });

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
Many extensions add non-native syntax to your code, which can be bad for maintenance longer term.
We suggest sticking to native syntax.
If you really need it, scroll below to see some usage examples.
:::

#### Resolve commonjs modules
CommonJS is the module format for NodeJS, and not suitable for the browser. Rollup only handles es modules by default, but sometimes it's necessary to be able to import a dependency. To do this, you can add [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs):
```javascript
import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';
import commonjs from 'rollup-plugin-commonjs';

const configs = createDefaultConfig({ input: './index.html' });

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
import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';

const config = createDefaultConfig({
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
import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';

const configs = createDefaultConfig({
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
import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';
import litcss from 'rollup-plugin-lit-css';

const configs = createDefaultConfig({ input: './index.html' });

// map if you use an array of configs, otherwise just extend the config
export default configs.map(config => ({
  ...config,
  plugins: [
    ...config.plugins,
    litcss({ include, exclude, uglify })
  ],
}));
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
