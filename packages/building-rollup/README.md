# Rollup

[//]: # (AUTO INSERT HEADER PREPUBLISH)

## Configuration
We provide a rollup configuration to help you get started using rollup with web components and modules.

Our configuration lets you write code using modern javascript syntax and features, providing the necessary syntax transformation and polyfills for older browsers. See 'config features' for more details.

See the extending section for more customization, such as supporting non-standard syntax or adding babel plugins.

## Setup

```bash
npm init @open-wc building-rollup
```

## Manual setup

1. Install the required dependencies:
```bash
npm i -D @open-wc/building-rollup rollup rimraf http-server
```

2. Create a file `rollup.config.js` and pass in your app's `index.html`:
```javascript
import createDefaultConfig from '@open-wc/building-rollup/modern-config';

export default createDefaultConfig({ input: './src/index.html' });
```

Our rollup config will look through your `index.html` and extract all module scripts and feed them to rollup.

3. Create an `index.html`:
```html
<!doctype html>
<html>
  <head></head>
  <body>
    <your-app></your-app>

    <script type="module" src="./your-app.js"></script>
  </body>
</html>
```

Note: our config will **not** handle inline module such as:
```html
  <script type="module">
    import { MyApp } from './my-app';
  </script>
```

4. Add the following commands to your `package.json`:
```json
{
  "scripts": {
    "build": "rimraf dist && rollup -c rollup.config.js",
    "start:build": "http-server dist -o",
    "watch:build": "rimraf dist && rollup --watch -c rollup.config.js & http-server dist -o",
  }
}
```
- `build` builds your app and outputs it in your `dist` directory
- `start:build` runs your built app from `dist` directory
- `watch:build` builds and runs your app, rebuilding when input files change

## Supporting legacy browsers
The `modern-config.js` based config we setup above works for browsers which support dynamic imports (Chrome 63+, Safari 11.1+, Firefox 67+)

If you need to support older browsers or Edge and IE11 you use our `modern-and-legacy-config.js` in your `rollup.config.js`:

```javascript
import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';

export default createDefaultConfig({ input: './src/index.html' });
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
  input: './src/index.html',
  // the directory to output files into, defaults to 'dist'. optional
  outputDir: '',
});
```

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

## Extending the rollup config
A rollup config is just a plain object. It's easy to extend it using javascript:
```javascript
import createDefaultConfig from '@open-wc/building-rollup/modern-config';

const config = createDefaultConfig({ input: './src/index.html' });

export default {
  ...config,
  output: {
    ...config.output,
    sourcemap: false,
  },
  plugins: {
    ...config.plugins,
    myAwesomePlugin(),
  },
};
```

If you use `modern-and-legacy-config.js`, it is actually an array of configs so that rollup outputs a modern and a legacy build. Simply `map` over the array to adjust both configs:

```javascript
import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';

const configs = createDefaultConfig({ input: './src/index.html' });

export default configs.map(config => ({
  ...config,
  output: {
    ...config.output,
    sourcemap: false,
  },
  plugins: {
    ...config.plugins,
    myAwesomePlugin(),
  },
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

const configs = createDefaultConfig({ input: './src/index.html' });

// map if you use an array of configs, otherwise just extend the config
export default configs.map(config => ({
  ...config,
  plugins: {
    ...config.plugins,
    commonjs(),
  },
});
```

### Copy assets
Web apps often include assets such as css files and images. These are not part of your regular dependency graph, so they need to be copied into the build directory.

[Rollup-plugin-cpy](https://github.com/shrynx/rollup-plugin-cpy) is a plugin that can be used, but there are other options too.

```javascript
import cpy from 'rollup-plugin-cpy';
import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';

const config = createDefaultConfig({
  input: './src/index.html',
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
  <script type="module" src="./my-app.ts"></script>
</body>
</html>
```

Make sure you set your `tsconfig.json` `target` and `module` fields to `ESNext`. This way typescript won't do any compilation so that babel can take care of it.

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

This is the fastest method, as it strips away types during babel transformation of your code. It will not perform any type checking though. We recommend setting up the type checking as part of your linting setup, so that you don't need to run the typechecker during development for faster builds.

#### 2. Plugin
It is also possible to add the rollup typescript plugin, which does typechecking and compiling for you:
```javascript
import typescript from 'rollup-plugin-typescript2';
import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';

const configs = createDefaultConfig({
  input: './src/index.html',
});

export default configs.map(config => ({
  ...config,
  plugins: [
    ...config.plugins,
    typescript(),
  ],
}));
```

Make sure to prevent any compilation done by the typescript compiler `tsconfig.json`, as babel and rollup do this for you:

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

const configs = createDefaultConfig({ input: './src/index.html' });

// map if you use an array of configs, otherwise just extend the config
export default configs.map(config => ({
  ...config,
  plugins: {
    ...config.plugins,
    litcss({ include, exclude, uglify })
  },
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
