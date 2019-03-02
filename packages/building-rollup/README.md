# Rollup

[//]: # (AUTO INSERT HEADER PREPUBLISH)

## Default configuration
We provide a good default configuration to help you get started using rollup with web components and modules.

Our configuration contains the minimal requirements for getting your app up and running, providing the necessary polyfills for older browsers. For more customization, such as installing custom babel plugins, see the extending section below.

## Manual setup

1. Install the required dependencies:
```bash
npm i -D @open-wc/building-rollup rollup rimraf http-server
```

2. Create a file `rollup.config.js` and pass in your app's index.html:
```javascript
import createDefaultConfig from '@open-wc/building-rollup/modern-config';

export default createDefaultConfig({ input: './index.html' });
```

Our rollup config will look through your index.html and extract all module scripts and feed them to rollup.

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
    "build": "rimraf dist && rollup",
    "start:build": "http-server dist -o",
    "watch:build": "rimraf dist && rollup --watch & http-server dist -o",
  }
}
```
- `build` builds your app and outputs it in your `dist` directory
- `start:build` runs your built app from `dist` directory
- `watch:build` builds and runs your app, rebuilding when input files change

## Supporting legacy browsers
`modern-config.js` we setup above works for modern browsers (see config features for more details).


If you need to support older browsers, use our `modern-and-legacy-config.js` in your `rollup.config.js`:

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
Our config accepts two options. Any further configuration can be done by extending the config
```javascript
export default createDefaultConfig({
  // your app's index.html. required
  input: './index.html',
  // the directory to output files into, defaults to 'dist'. optional
  outputDir: '',
});
```

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
The rollup config is just a plain object. It's easy to extend it using javascript:
```javascript
import createDefaultConfig from '@open-wc/building-rollup/modern-config';

const config = createDefaultConfig({ input: './index.html' });

export default {
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

### Common extensions
::: warning
Many extensions add non-native syntax to your code, which can be bad for maintenance longer term.
We suggest sticking to native syntax.
If you really need it scroll below to see some usage examples.
:::

#### Resolve commonjs
CommonJS is the module format for NodeJS, and not suitable for the browser. Rollup only handles es modules by default, but sometimes it's necessray to be able to import a dependency. To do this, you can add [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs):
```javascript
import commonjs from 'rollup-plugin-commonjs';

const config = createDefaultConfig({ input: './index.html' });

export default {
  plugins: [
    ...config.plugins,
    commonjs()
  ],
};
```

#### Import CSS files in lit-html
To separate your lit-html styles in css files, you can use [rollup-plugin-lit-css](https://github.com/bennypowers/rollup-plugin-lit-css):

```javascript
import litcss from 'rollup-plugin-lit-css';

const config = createDefaultConfig({ input: './index.html' });

export default {
  plugins: [
    ...config.plugins,
    litcss({ include, exclude, uglify })
  ],
};
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
