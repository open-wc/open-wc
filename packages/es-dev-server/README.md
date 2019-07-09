# ES dev server

[//]: # (AUTO INSERT HEADER PREPUBLISH)

A dev server for modern web development workflows.

Without any flags, `es-dev-server` acts as a simple static file server. Through flags different features can be enabled, such as:
- reloading the browser on file changes
- resolve bare module imports using node resolution
- history API fallback for SPA routing
- HTTP2 and smart caching to speed up file serving
- Compatibility mode for older browsers

Compatibility mode enables bundle-free development with modern javascript, es modules and import maps on older browsers, including IE11.

This is made possible by two great projects:
- [es-module-shims](https://github.com/guybedford/es-module-shims) for shimming new module features
- [systemjs](https://github.com/systemjs/systemjs) for polyfilling modules on older browser which don't support them

[Read more about compatibility mode here.](#compatibility-mode)

## Installation
```bash
npm i -D es-dev-server
```

## Usage
```
// package.json
"scripts": {
  "start": "es-dev-server"
}

// bash
npm run start

// or via npx
npx es-dev-server
```

## Basic workflows
### Static server

This setup does no code transformation at all. Great for blazing fast development on the latest browsers or when running a production build of your app.

```bash
npx es-dev-server --watch --open index.html
```

HTTP/2 is useful when serving unbundled code as it is better at handling many concurrent requests. It requires a HTTPS connection, we do this using self-signed certificates. On first run the browser will prompt a warning, you will need to accept the certificates before proceeding. Since you are on localhost, this is safe to do.

```bash
npx es-dev-server --watch --http2 --open index.html
```

### SPA Routing

If your app does routing in front-end using the history API you can setup the server to serve your `index.html` on any route request. For this you need to pass the `--app-index` flag. If you set this flag, `--open` will open on that path automatically.

```bash
npx es-dev-server --app-index index.html --watch --http2 --open
```

### Resolve bare module imports

If you are using "bare" module imports (`import foo from 'bar';`) without valid paths, the browser will not understand them.

You can use the `node-resolve` flag to resolve your bare module imports before being served to the browser:

```bash
npx es-dev-server --app-index index.html --watch --http2 --node-resolve --open
```

[The import maps proposal](https://github.com/WICG/import-maps) aims to resolve the need for editing your source code before it is served to the browser but it is still experimental.

### Use with new javascript syntax and features on older browsers

Compatibility mode is a great way to use new features without requiring a bundler for developing or testing on different browsers. Turning on compatibility mode will cause `es-dev-server` to do the minimal required code transformation, and injects polyfills when necessary.

There are three different compatibility modes you can use:

```bash
# esm: use dynamic import and import maps on all browsers that support modules
npx es-dev-server --app-index index.html --watch --http2 --compatibility esm --open

# modern: use latest javascript features and syntax on latest 2 chrome, safari, firefox and edge
npx es-dev-server --app-index index.html --watch --http2 --compatibility modern --open

# all: use latest javascript features and syntax on older browsers, down to IE11
npx es-dev-server --app-index index.html --watch --http2 --compatibility all --open
```

Note that "latest javascript features and syntax" is a general term, not everything can be polyfilled/shimmed properly. [Read more here](#compatibility-mode) for full details on compatibility mode.

## Command line flags overview
### Server configuration
| name                 |  type          | description                                                              |
| -------------------- | -------------- | ------------------------------------------------------------------------ |
| port                 | number         | The port to use. Default: 8080                                           |
| hostname             | string         | The hostname to use. Default: localhost                                  |
| open                 | boolean/string | Opens the browser on app-index, root dir or a custom path                |
| app-index            | string         | The app's index.html file, sets up history API fallback for SPA routing  |
| root-dir             | string         | The root directory to serve files from. Default: working directory       |
| config               | string         | The file to read configuration from (js or json)                         |
| help                 | none           | See all options                                                          |

### Development help
| name                 |  type          | description                                                              |
| -------------------- | -------------- | ------------------------------------------------------------------------ |
| watch                | boolean        | Reload the browser when files are edited                                 |
| http2                | number         | Serve files over HTTP2. Sets up HTTPS with self-signed certificates      |

### Code transformation
| name                 |  type          | description                                                              |
| -------------------- | -------------- | ------------------------------------------------------------------------ |
| node-resolve         | number         | Resolve bare import imports using node resolve                           |
| compatibility        | string         | Compatibility mode for older browsers. Can be: `esm`, `modern` or `all`  |
| module-dirs          | string/array   | Directories to resolve modules from. Used by node-resolve                |
| babel                | number         | Transform served code through babel. Requires .babelrc                   |
| file-extensions      | number/array   | Extra file extentions to use when transforming code.                     |
| babel-exclude        | number/array   | Patterns of files to exclude from babel compilation.                     |
| babel-modern-exclude | number/array   | Patterns of files to exclude from babel compilation on modern browsers.  |

Most commands have an alias/shorthand. You can view them by using `--help`.

## Advanced usage

### Configuration files
We pick up an `es-dev-server.config.js` file automatically if it is present in the current working directory. You can specify a custom config path using the `config` flag.
<details>
  <summary>Read more</summary>

  The configuration file allows the same command line flags configured, using their camelCased names. Example:
  ```javascript
  module.exports = {
    port: 8080,
    appIndex: 'demo/index.html',
    moduleDirs: ['node_modules', 'custom-modules']
  }
```
</details>

### Custom middlewares / proxy

You can install custom middlewares, using the `customMiddlewares` property.

<details>
  <summary>Read more</summary>

  The middleware should be a standard koa middleware. [Read more about koa here.](https://koajs.com/)

  You can use custom middlewares to set up a proxy, for example:
  ```javascript
  const proxy = require('koa-proxies');

  module.exports = {
    port: 9000,
    customMiddlewares: [
      proxy('/api', {
        target: 'http://localhost:9001',
      })
    ],
  };
  ```
</details>

### Typescript support
`es-dev-server` is based around developing without any build tools, however you can make it work with typescript as well.

<details>
  <summary>Read more</summary>

  The easiest way to use the server with typescript is to compile your typescript to javascript before running the server. Just run `tsc` in watch mode and include the compiled js files from your `index.html`.

  You can also configure the dev server to consume your typescript files directly. This is done by running the server with a babel plugin to compile your typescript files to javascript.

  Note that when compiling typescript with babel it does not do any type checking or special typescript compilation such as decorators, class fields and enums. You can configure babel to cover most of these, but not all. [Read more about babel typescript here](https://babeljs.io/docs/en/babel-plugin-transform-typescript).

  1. Install the preset:
  ```bash
  npm i --save-dev @babel/preset-typescript
  ```

  2. Add a `babel.config.js` or `.babelrc` to your project:
  ```json
  {
    "presets": [
      "@babel/preset-typescript"
    ]
  }
  ```

  3. Import a typescript file from your `index.html`
  ```html
  <html>
    <head></head>

    <body>
      <script type="module" src="./my-app.ts"></script>
    </body>
  </html>
  ```

  4. Run `es-dev-server` with these flags:
  ```bash
  es-dev-server --file-extensions .ts --node-resolve --babel --open
  ```

  To add support for experimental features which are normally handled by the typescript compiler, you can add extra babel plugins. Because typescript implements the legacy decorators proposal, you need to add the legacy flag and add class properties in loose mode:

  1. Install the plugins:
  ```bash
  npm i --save-dev @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
  ```

  2. Update your babel configuration:
  ```json
  {
    "plugins": [
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ],
    "presets": [
      "@babel/preset-typescript"
    ]
  }
  ```

</details>

## Compatibility mode

Compatibility mode enables bundle-free development with features such as es modules and import maps on older browsers, including IE11.

<details>

  <summary>Read more</summary>

  If you want to make use of import maps, you can provide an import map in your `index.html`. To generate an import map, you can check out our package [import-maps-generate](https://github.com/open-wc/open-wc/tree/master/packages/import-maps-generate), or alternatively you can add one manually.

  There are three modes that can be enabled:
  ### esm
  `esm` mode adds [es-module-shims](https://github.com/guybedford/es-module-shims) to enable new module features such as dynamic imports and import maps.

  This mode has a neglible performance impact, and is great when working on modern browsers.

  ### modern
  `modern` mode expands `esm` mode, adding a babel transform and a polyfill loader.

  The babel transform uses the [present-env](https://babeljs.io/docs/en/babel-preset-env) plugin. This transforms standard syntax which isn't yet supported by all browsers. By default it targets latest two versions of Chrome, Safari, Firefox and Edge. This can be configured with a [browserslist configuration](https://www.npmjs.com/package/browserslist).

  The polyfill loader does lightweight feature detection to determine which polyills to load. By default it loads polyfills for webcomponents, these can be turned off or custom polyfills can be added in the configuration.

  This mode has a moderate performance impact. Use this when using new javascript syntax that is not yet supported on all browsers.

  ### all
  `all` mode expands `modern` mode by making your code compatible with browsers which don't yet support modules.

  In addition to the web component polyfills, it loads the general [core-js polyfills](https://www.npmjs.com/package/core-js) and a polyfill for [fetch](https://www.npmjs.com/package/whatwg-fetch)

  When loading your application it detects module support. If it is not supported, your app is loaded through [systemjs](https://github.com/systemjs/systemjs) and your code is transformed to `es5`.

  The `es5` transformation is only done for browsers which don't support modules, so you can safely use this mode on modern browsers where it acts the same way as `modern` mode.

  `all` mode has the same moderate impact as `modern` mode on browsers that support modules. On browsers which don't support modules it has a heavier impact. Use this mode if you want to verify if your code runs correctly on older browsers without having to run a build.

</details>


<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/es-dev-server/README.md';
      }
    }
  }
</script>
