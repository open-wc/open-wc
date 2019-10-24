# ES dev server

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

A web server for developing without a build step.

By default, `es-dev-server` acts as a simple static file server. Through flags, different features can be enabled, such as:

- reloading the browser on file changes
- resolve bare module imports using node resolution
- history API fallback for SPA routing
- Smart caching to speed up file serving
- Compatibility mode for older browsers

Compatibility mode enables bundle-free development with modern javascript, es modules and import maps on all major browsers and IE11.

## Getting started

We recommend [following this guide](https://dev.to/open-wc/developing-without-a-build-2-es-dev-server-1cf5) for a step by step overview of different workflows with `es-dev-server`.

## Setup

With our project scaffolding you can set up a pre-configured project:

```bash
npm init @open-wc
```

### Manual

You can also set up the dev server manually:

```bash
npm i -D es-dev-server
```

Add scripts to your `package.json`, modify the flags as needed:

```json
{
  "scripts": {
    "start": "es-dev-server --app-index index.html --node-resolve --watch --open",
    "start:compatibility": "es-dev-server --compatibility all --app-index index.html --node-resolve --watch --open"
  }
}
```

Run the server:

```bash
npm run start
```

## Node version

es-dev-server requires node v10 or higher

## Command line flags and Configuration

### Server configuration

| name      | type           | description                                                             |
| --------- | -------------- | ----------------------------------------------------------------------- |
| port      | number         | The port to use, uses a random free port if not set.                    |
| hostname  | string         | The hostname to use. Default: localhost                                 |
| open      | boolean/string | Opens the browser on app-index, root dir or a custom path               |
| app-index | string         | The app's index.html file, sets up history API fallback for SPA routing |
| root-dir  | string         | The root directory to serve files from. Default: working directory      |
| base-path | string         | Base path the app is served on. Example: /my-app                        |
| config    | string         | The file to read configuration from (JS or JSON)                        |
| help      | none           | See all options                                                         |

### Development help

| name  | type    | description                                                         |
| ----- | ------- | ------------------------------------------------------------------- |
| watch | boolean | Reload the browser when files are edited                            |
| http2 | boolean | Serve files over HTTP2. Sets up HTTPS with self-signed certificates |

### Code transformation

| name                 | type         | description                                                             |
| -------------------- | ------------ | ----------------------------------------------------------------------- |
| compatibility        | string       | Compatibility mode for older browsers. Can be: `esm`, `modern` or `all` |
| node-resolve         | number       | Resolve bare import imports using node resolve                          |
| preserve-symlinks    | boolean      | Preserve symlinks when resolving modules. Default false.                |
| module-dirs          | string/array | Directories to resolve modules from. Used by node-resolve               |
| babel                | boolean      | Transform served code through babel. Requires .babelrc                  |
| file-extensions      | number/array | Extra file extensions to use when transforming code.                    |
| babel-exclude        | number/array | Patterns of files to exclude from babel compilation.                    |
| babel-modern-exclude | number/array | Patterns of files to exclude from babel compilation on modern browsers. |

Most commands have an alias/shorthand. You can view them by using `--help`.

### Configuration files

We pick up an `es-dev-server.config.js` file automatically if it is present in the current working directory. You can specify a custom config path using the `config` flag.

Configuration options are the same as command line flags, using their camelCased names. Example:

```javascript
module.exports = {
  port: 8080,
  watch: true,
  nodeResolve: true,
  appIndex: 'demo/index.html',
  moduleDirs: ['node_modules', 'custom-modules'],
};
```

In addition to the command-line flags, the configuration file accepts these additional options:

| name        | type   | description                                            |
| ----------- | ------ | ------------------------------------------------------ |
| middlewares | array  | Koa middlewares to add to the server, read more below. |
| babelConfig | object | Babel config to run with the server                    |

## Folder structure

`es-dev-server` serves static files using the same structure as your file system. It cannot serve any files outside of the root of the webserver. You need to make sure any files requested, including node modules, are accessible for the webserver.

Click read more to view different strategies for setting up your project's folder structure.

<details>
  <summary>Read more</summary>

### index.html in root

The simplest setup where all files are accessible is to place your index.html at the root of your project:

```
node_modules/...
src/...
index.html
```

If you run `es-dev-server` regularly from the root of this project, you can access your app at `/` or `/index.html` in the browser.

### index.html in a subfoolder

If you move your `index.html` inside a subfolder:

```
node_modules/...
src/...
src/index.html
```

You can access your app in the browser at `/src/` or `/src/index.html`. You can tell `es-dev-server` to explicitly open at this path:

```bash
# with app-index flag
es-dev-server --app-index src/index.html --open
# without app-index flag
es-dev-server --open src/
```

You can also change the root directory of the dev server:

```bash
es-dev-server --root-dir src --open
```

Now your `index.html` is accessible at `/` or `/index.html`. However, the dev server cannot serve any files outside of the root directory. So if your app uses any node modules, they will no longer because accessible.

If you want your index in a subfolder without this being visible in the browser URL, you can set up a file rewrite rule. [Read more here](#rewriting-file-requests)

### Monorepos

If you are using `es-dev-server` in a monorepo, your node modules are in two different locations. In the package's folder and the repository root:

```
node_modules/...
packages/my-package/node_modules/...
packages/my-package/index.html
```

You will need to make sure the root node_modules folder is accessible to the dev server.

If your working directory is `packages/my-package` you can use this command:

```bash
# with app-index
es-dev-server --root-dir ../../ --app-index packages/my-package/index.html --open
# without app-index
es-dev-server --root-dir ../../ --open packages/my-package/index.html
```

If your working directory is the root of the repository you can use this command:

```bash
es-dev-server --app-index packages/my-package/index.html --open
```

This is the same approach as serving an index.html in a subdirectory, so the section above applies here as well.

### Base element

You can set up a `<base href="">` element to modify how files are resolved relatively to your index.html. You can be very useful when your index.html is not at the root of your project.

If you use SPA routing, using a base element is highly recommended. [Read more](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)

</details>

## Advanced usage

### Custom middlewares / proxy

You can install custom middlewares, using the `middlewares` property.

<details>
  <summary>Read more</summary>

The middleware should be a standard koa middleware. [Read more about koa here.](https://koajs.com/)

You can use custom middlewares to set up a proxy, for example:

```javascript
const proxy = require('koa-proxies');

module.exports = {
  port: 9000,
  middlewares: [
    proxy('/api', {
      target: 'http://localhost:9001',
    }),
  ],
};
```

</details>

### Rewriting file requests

You can rewrite certain file requests using a simple custom middleware. This can be useful for example to serve your `index.html` from a different file location.

<details>
  <summary>Read more</summary>

Set up a configuration file with a custom middleware:

```javascript
module.exports = {
  middlewares: [
    function rewriteIndex(context, next) {
      if (context.url === '/' || context.url === '/index.html') {
        context.url = '/src/index.html';
      }

      return next();
    },
  ],
};
```

This way from the browser you can request `/` or `/index.html` and it will serve `/src/index.html`. This middleware is run before the dev server's file serving logic, which will use the rewritten URL.

</details>

### Typescript support

`es-dev-server` is based around developing without any build tools but you can make it work with typescript as well.

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
  "presets": ["@babel/preset-typescript"]
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

To add support for experimental features that are normally handled by the typescript compiler, you can add extra babel plugins:

1. Install the plugins:

```bash
npm i --save-dev @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
```

2. Update your babel configuration:

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

## Compatibility mode

Compatibility mode enables bundle-free development with features such as es modules and import maps on older browsers, including IE11.

<details>

  <summary>Read more</summary>

If you want to make use of import maps, you can provide an import map in your `index.html`. To generate an import map, you can check out our package [import-maps-generate](https://github.com/open-wc/open-wc/tree/master/packages/import-maps-generate), or you can add one manually.

Three modes can be enabled:

### esm

`esm` mode adds [es-module-shims](https://github.com/guybedford/es-module-shims) to enable new module features such as dynamic imports and import maps.

This mode has a negligible performance impact and is great when working on modern browsers.

### modern

`modern` mode expands `esm` mode, adding a babel transform and a polyfill loader.

The babel transform uses the [present-env](https://babeljs.io/docs/en/babel-preset-env) plugin. This transforms standard syntax which isn't yet supported by all browsers. By default, it targets the latest two versions of Chrome, Safari, Firefox, and Edge. This can be configured with a [browserslist configuration](https://www.npmjs.com/package/browserslist).

The polyfill loader does lightweight feature detection to determine which polyfills to load. By default it loads polyfills for web components, these can be turned off or custom polyfills can be added in the configuration.

This mode has a moderate performance impact. Use this when using new javascript syntax that is not yet supported on all browsers.

### all

`all` mode expands `modern` mode by making your code compatible with browsers that don't yet support modules.

In addition to the web component polyfills, it loads the general [core-js polyfills](https://www.npmjs.com/package/core-js) and a polyfill for [fetch](https://www.npmjs.com/package/whatwg-fetch)

When loading your application it detects module support. If it is not supported, your app is loaded through [system-js](https://github.com/systemjs/systemjs) and your code is transformed to `es5`.

The `es5` transformation is only done for browsers which don't support modules, so you can safely use this mode on modern browsers where it acts the same way as `modern` mode.

`all` mode has the same moderate impact as `modern` mode on browsers that support modules. On browsers that don't support modules, it has a heavier impact. Use this mode if you want to verify if your code runs correctly on older browsers without having to run a build.

</details>

## Using es-dev-server programmatically

You can use different components from `es-dev-server` as a library and integrate it with other tools:

<details>

<summary>Read more</summary>

### createConfig

When using the server from javascript you are going to need a config object to tell the server what options to turn on and off. It's best to use `createConfig` for this as this converts the public API to an internal config structure and sets up default values.

By default, all options besides static file serving are turned off, so it's easy to configure based on your requirements.

The config structure is the same as the configuration explained in the [configuration files section](#configuration-files)

```javascript
import { createConfig } from 'es-dev-server';

const config = createConfig({
  http2: true,
  babel: true,
  open: true,
});
```

### createMiddlewares

`createMiddlewares` creates the dev server's middlewares based on your configuration. You can use this to hook them up to your koa server.

Returns an array of koa middleware functions.

```javascript
import Koa from 'koa';
import { createConfig, createMiddlewares } from 'es-dev-server';

const config = createConfig({});
const middlewares = createMiddlewares(config);

const app = new Koa();
middlewares.forEach(middleware => {
  app.use(middleware);
});
```

### createServer

`createServer` creates an instance of the dev server including all middlewares, but without starting the server. This is useful if you want to be in control of starting the server yourself.

Returns the koa app and a node http or http2 server.

```javascript
import Koa from 'koa';
import { createConfig, createServer } from 'es-dev-server';

const config = createConfig({ ... });
const { app, server } = createServer(config);
server.listen(3000);
```

### watch mode

`createMiddlewares` and `createServer` requires a chokidar fileWatcher if watch mode is enabled. You need to pass this separately because the watcher needs to be killed explicitly when the server closes.

```javascript
import Koa from 'koa';
import chokidar from 'chokidar';
import { createConfig, createMiddlewares, createServer } from 'es-dev-server';

const config = createConfig({ ... });
const fileWatcher = chokidar.watch([]);

// if using createMiddlewares
createMiddlewares(config, fileWatcher);
// if using createServer
createServer(config, fileWatcher);

// close filewatcher when no longer necessary
fileWatcher.close();
```

### startServer

`startServer` creates and starts the server, listening on the configured port. It opens the browser if configured and logs a startup message.

Returns the koa app and a node http or http2 server.

```javascript
import Koa from 'koa';
import { createConfig, startServer } from 'es-dev-server';

const config = createConfig({ ... });
const { app, server } = startServer(config, fileWatcher);
```

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
