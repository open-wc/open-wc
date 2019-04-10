# Dev server

[//]: # (AUTO INSERT HEADER PREPUBLISH)

A simple web server for simple web developers. Does the minimal amount of work required for web development on modern web browsers. Specifically designed to work with the native es module loader available in all major browsers.

### Resolves node-style module imports to browser-style
Browsers only accept fully resolved paths in module imports. This is infeasible when working with many dependencies in a project. This the only code transform this server does for you:

```javascript
import { html } from 'lit-html';
```
becomes:
```javascript
import { html } from '../../node_modules/lit-html/lit-html.js';
```
This will become obsolete over time, as a similar behavior is being standardized in browsers. It's called [import maps](https://github.com/WICG/import-maps).

Note: import paths are only resolved within `.js` files. This means you cannot do a bare module import from your `index.html`:
```html
<html>
  <head>
    <script>
      import { html } from 'lit-html'; // does not work
    </script>
  </head>
  <body></body>
</html>
```

::: warning
Please note that the owc-dev-server *only resolves bare module specifiers*, and does nothing to transform different module formats like [CommonJS](https://requirejs.org/docs/commonjs.html). If this is a requirement for you, please check out our [rollup configuration](/building/building-rollup/).
:::


### Usage
```bash
npm i -D owc-dev-server
```

#### Execute
```
// package.json
"scripts": {
  "start": "owc-dev-server"
}

// bash
npm run start

// or via npx
npx owc-dev-server
```

#### Static files
By default the server will just serve up static files from your current working directory:
```bash
npx owc-dev-server --open
```
You can open the server at a specific file/location:
```bash
npx owc-dev-server --open demo/my-file.html
npx owc-dev-server --open demo
```
To change the server's root directory:
```bash
npx owc-dev-server ./dist
# or
npx owc-dev-server --root-dir ./dist
```

#### Single Page App
For a SPA, you will want non-file requests to serve the app's index so that you can handle routing within your app. The browser will automatically open at your app's root path.
```bash
npx owc-dev-server --app-index index.html --open
```
Note: That this will require a `<base href="/">` in your html head.

#### Component project
When working on a (web) component project, you will usually have a demo folder for local development:
```bash
npx owc-dev-server --open demo/
```

If your demo itself is a SPA, you can also specify the app-index option:
```bash
npx owc-dev-server --app-index demo/index.html --open
```

### Additional configs like a proxy
If you need additional configuration for the server you can provide them via a config file `.owc-dev-server.config.js`.
```js
// example for a proxy middleware for netlify lambda functions
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/.netlify/functions/', {
    target: 'http://localhost:9000/',
    "pathRewrite": {
      "^/\\.netlify/functions": ""
    }
  }));
};
```

### Command line options
| name          | alias | type           | description                                                             |
| ------------- | ----- | -------------- | ----------------------------------------------------------------------- |
| --port        | -p    | number         | The port to use. Default: 8080                                          |
| --hostname    | -h    | string         | The hostname to use. Default: localhost                                 |
| --open        | -o    | string/boolean | Opens the default browser on the given path or default /                |
| --app-index   | -a    | string         | The app's index.html file. When set, serves the index.html for non-file |
| --root-dir    | -r    | string         | The root directory to serve files from. Defaults to the project root.   |
| --modules-dir | -m    | string         | Directory to resolve modules from. Default: node_modules                |
| --config-file | -c    | string         | File with additional config. Default: .owc-dev-server.config.js         |
| --help        | none  | none           | See all options                                                         |

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/owc-dev-server/README.md';
      }
    }
  }
</script>
