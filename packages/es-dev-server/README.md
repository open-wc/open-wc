# ES dev server

A web server for development without bundling, utilizing the browser's standard module loader and efficient browser caching for simple and fast web development.

```bash
npx es-dev-server --node-resolve --watch
```

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

**Quick overview**

- efficient browser caching for fast reloads
- [transform code on older browsers for compatibility](#compatibility-mode)
- [resolve bare module imports for use in the browser](#node-resolve) (`--node-resolve`)
- [deduplicate multiple installations of the same package](#dedupe)
- auto reload the browser on file changes with the (`--watch`)
- history API fallback for SPA routing with the (`--app-index index.html`)

[See all commands](#Command%20line%20flags%20and%20Configuration)

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
    "start": "es-dev-server --app-index index.html --node-resolve --watch --open"
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

| name                 | type          | description                                                                                                                     |
| -------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| compatibility        | string        | Compatibility mode for older browsers. Can be: `auto`, `always`, `min`, `max` or `none` Default `auto`                          |
| node-resolve         | boolean       | Resolve bare import imports using node resolve                                                                                  |
| dedupe               | boolean/array | Deduplicates all modules, or modules from specified packages if the value is an array                                           |
| preserve-symlinks    | boolean       | Preserve symlinks when resolving modules. Set to true, if using tools that rely on symlinks, such as `npm link`. Default false. |
| module-dirs          | string/array  | Directories to resolve modules from. Used by node-resolve                                                                       |
| babel                | boolean       | Transform served code through babel. Requires .babelrc                                                                          |
| file-extensions      | string/array  | Extra file extensions to use when transforming code.                                                                            |
| babel-exclude        | number/array  | Patterns of files to exclude from babel compilation.                                                                            |
| babel-modern-exclude | number/array  | Patterns of files to exclude from babel compilation on modern browsers.                                                         |
| babel-module-exclude | number/array  | Patterns of files to exclude from babel compilation for modules only.                                                           |

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
  moduleDirs: ['node_modules', 'web_modules'],
};
```

In addition to the command-line flags, the configuration file accepts these additional options:

| name                 | type    | description                                              |
| -------------------- | ------- | -------------------------------------------------------- |
| middlewares          | array   | Koa middlewares to add to the server, read more below.   |
| responseTransformers | array   | Functions which transform the server's response.         |
| babelConfig          | object  | Babel config to run with the server.                     |
| polyfillsLoader      | object  | Configuration for the polyfills loader, read more below. |
| debug                | boolean | Whether to turn on debug mode on the server.             |

## Node resolve

"Bare imports" are imports which don't specify a full path to a file:

```js
import foo from 'bar';
```

The browser doesn't know where to find this file called `bar`. The `--node-resolve` flag resolves this bare import to the actual file path before serving it to the browser:

```js
import foo from './node_modules/bar/bar.js';
```

Because we use [es-module-lexer](https://github.com/guybedford/es-module-lexer) for blazing fast analysis to find the imports in a file without booting up a full-blown parser like babel, we can do this without noticeable impact on performance.

For the actual resolve logic, we internally use [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) so that you can keep the resolve logic in sync between development and production. When using a config file, the `nodeResolve` can also be an object which accepts the same options as the rollup plugin. options.

<details>
<summary>Example config</summary>

See [the rollup docs](https://github.com/rollup/plugins/tree/master/packages/node-resolve) for all options and what they do.

Some options like `dedupe`, `fileExtensions`, `preserveSymlinks` and `moduleDirs` are mapped to options for `nodeResolve` internally. You can overwrite them with your custom config.

```js
module.exports = {
  nodeResolve: {
    jsnext: true,
    browser: true,
    // set default to false because es-dev-server always
    // runs in the browser
    preferBuiltins: true,
    // will overwrite es-dev-server's fileExtensions option
    extensions: ['.mjs', '.js'],
    // will overwrite es-dev-server's dedupe option
    dedupe: ['lit-html'],
    customResolveOptions: {
      // will overwrite es-dev-server's moduleDirs option
      moduleDirectory: ['node_modules'],
      preserveSymlinks: true,
    },
  },
};
```

</details>

In future, we are hoping that [import maps](https://github.com/WICG/import-maps) will make this step unnecessary.

## Dedupe

When your dependencies depend on different versions of the same package, package managers like yarn or npm may end up installing multiple versions of the same package with nested `node_modules` directories. This can create problems when modules expect to be singletons on the page, or when it includes side-effects such as custom element registration which can only be run once.

You can use the `dedupe` option to ensure a particular package is only loaded once by resolving from the root of the package instead of relative to the originating module.

When `dedupe` is a boolean, all packages are deduplicated:

```bash
es-dev-server --dedupe
```

When it is an array, only the specified packages are deduplicated. An array can only be set from a config:

```javascript
module.exports = {
  dedupe: ['foo', 'bar'],
};
```

## Folder structure

`es-dev-server` serves static files using the same structure as your file system. It cannot serve any files outside of the root of the webserver. You need to make sure any files requested, including node modules, are accessible for the webserver.

Outside of that one requirement, however, `es-dev-server` does not have any opinions on how you should scaffold your project. The following are examples of a variety of different suggested strategies for setting up your project's folder structure.

### index.html in the Root

<details>
  <summary>The simplest setup, making sure that all files are accessible, is to place your index.html at the root of your project</summary>

Consider this example directory structure in the web root:

```
node_modules/...
src/...
index.html
```

If you run the `es-dev-server` command from the root of the project, you can access your app at `/` or `/index.html` in the browser.

</details>

### index.html in a Subfolder

If you move your `index.html` inside a subfolder:

<details>
  <summary>Use the `--open` parameter for when you'd like to keep you index.html in a subfolder.</summary>

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

</details>

### Monorepos

<details>
  <summary>Use `--app-index` or `--root-dir` when your index.html and web root are in different places, e.g.. in a monorepo setup.</summary>

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

</details>

### Base Element

<details>
  <summary>Use platform features to specify your web root, e.g. in <abbr title="Single Page Applications">SPAs</abbr></summary>

You can set up a `<base href="">` element to modify how files are resolved relatively to your index.html. This can be very useful when your index.html is not at the root of your project.

If you use <abbr title="Single Page Application">SPA</abbr> routing, using a base element is highly recommended. [Read more](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)

</details>

## Order of execution

The order of execution for the es-dev-server is:

1. Custom middlewares
2. Es-dev-server static file middleware
3. Response transformers
4. Es-dev-server code transform middlewares
5. Es-dev-server response cache (it also caches the code transformations!)
6. Deferred custom middlewares

Take this into account when deciding between response transformers, custom middlewares and whether or not you defer your custom middleware.

For example, a deferred custom middleware may be necessary if you need to do something with the response body **after** caching.

```javascript
async function myMiddleware(ctx, next) {
  ctx.url = ctx.url.replace('foo', 'bar');
  // before es-dev-server
  await next();
  // deferred, after es-dev-server
  ctx.body = ctx.body.replace('foo', 'bar');
}
```

## Custom middlewares / proxy

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

## Rewriting request urls

You can rewrite certain file requests using a simple custom middleware. This can be useful for example to serve your `index.html` from a different file location or to alias a module.

<details>
  <summary>Read more</summary>

Serve `/index.html` from `/src/index.html`:

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

</details>

## Response transformers

With the `responseTransformers` property, you can transform the server's response before it is sent to the browser. This is useful for injecting code into your index.html, performing transformations on files or to serve virtual files programmatically.

<details>
  <summary>Read more</summary>

A response transformer is a function which receives the original response and returns an optionally modified response. This transformation happens before any other built-in transformations such as node resolve, babel or compatibility. You can register multiple transformers, they are called in order.

The functions can be sync or async, see the full signature below:

```typescript
({ url: string, status: number, contentType: string, body: string }) => Promise<{ body?: string, contentType?: string } | null>
```

Some examples:

Rewrite the base path of your `index.html`:

```javascript
module.exports = {
  responseTransformers: [
    function rewriteBasePath({ url, status, contentType, body }) {
      if (url === '/' || url === '/index.html') {
        const rewritten = body.replace(/<base href=".*">/, '<base href="/foo/">');
        return { body: rewritten };
      }
    },
  ],
};
```

Serve a virtual file, for example an auto generated `index.html`:

```javascript
const indexHTML = generateIndexHTML();

module.exports = {
  responseTransformers: [
    function serveIndex({ url, status, contentType, body }) {
      if (url === '/' || url === '/index.html') {
        return { body: indexHTML, contentType: 'text/html' };
      }
    },
  ],
};
```

Transform markdown to HTML:

```javascript
const markdownToHTML = require('markdown-to-html-library');

module.exports = {
  responseTransformers: [
    async function transformMarkdown({ url, status, contentType, body }) {
      if (url === '/readme.md') {
        const html = await markdownToHTML(body);
        return {
          body: html,
          contentType: 'text/html',
        };
      }
    },
  ],
};
```

Polyfill CSS modules in JS:

```javascript
module.exports = {
  responseTransformers: [
    async function transformCSS({ url, status, contentType, body }) {
      if (url.endsWith('.css')) {
        const transformedBody = `
          const stylesheet = new CSSStyleSheet();
          stylesheet.replaceSync(${JSON.stringify(body)});
          export default stylesheet;
        `;
        return { body: transformedBody, contentType: 'application/javascript' };
      }
    },
  ],
};
```

</details>

## Typescript support

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

Compatibility mode enables bundle-free development using modern browsers features on older browsers. Automatic compatibility mode is enabled by default.

<details>

  <summary>Read more</summary>

Compatibility mode can be configured using the `--compatibility` flag. The possible options are: `auto`, `min`, `max` and `none`. The default is mode is `auto`.

**auto**
`auto` compatibility looks at the current browser to determine the level of compatibility to enable. On the latest 2 versions of the major browsers, it doesn't do any work. This keeps the server as fast as possible in the general case.

On older browsers, the server uses the browser's user agent and [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) to do a targeted transformation for that specific browser and version. `@babel/preset-env` only works with with stage 4 javascript features, they should become an official standard before they can be used.

If the browser does not support es module scripts, dynamic imports or `import.meta.url` es modules are transformed to [system-js](https://github.com/systemjs/systemjs).

This works down to at least IE11. Depending on what browser features you are using, it might work with earlier version too but this is not tested.

**always**
`always` compatibility is the same as `auto`, except that it doesn't skip compiling on the latest 2 versions of the major browsers. This makes it a bit slower on modern browsers, but allows you to use new features before they are implemented in the browser.

**min**
`min` compatibility forces the same level of compatibility on all browsers. It makes code compatible with the latest two versions of the major browsers, and does not transform es modules.

**max**
`max` compatibility forces the same level of compatibility on all browsers. It compiles everything to es5 and [system-js](https://github.com/systemjs/systemjs).

**none**
`none` disables compatibility mode entirely.

</details>

### Polyfills loader

When compatibility mode is enabled, polyfills are loaded using [polyfills-loader](https://github.com/open-wc/open-wc/tree/master/packages/polyfills-loader).

<details>
  <summary>Read more</summary>

You can customize the polyfill loader configuration from your configuration file. Check the docs for the [polyfills-loader](https://github.com/open-wc/open-wc/tree/master/packages/polyfills-loader) for all possible options.

```js
module.exports = {
  polyfillsLoader: {
    polyfills: {
      fetch: false,
      custom: [
        {
          name: 'my-feature-polyfill',
          path: require.resolve('my-feature-polyfill'),
          test: "!('myFeature' in window)",
        },
      ],
    },
  },
};
```

By default, es-dev-server wraps all scripts and are deferred until polyfills are loaded. Loading order of scripts are preserved, but this can create problems if you rely on a script being executed before HTML is parsed. You can configure `es-dev-server` to exclude certain types of scripts:

```js
module.exports = {
  polyfillsLoader: {
    exclude: {
      jsModules: true,
      inlineJsModules: true,
      jsScripts: true,
      inlineJsScripts: true,
    },
  },
};
```

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
