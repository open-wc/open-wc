---
permalink: 'developing/es-dev-server.html'
title: ES dev server
section: guides
tags:
  - guides
---

> **Notice**
>
> Development of es-dev-server continues under a new name: [web dev server](https://modern-web.dev/docs/dev-server/overview/). We recommend using it for new projects, and upgrading for existing projects.
>
> We will continue to support fixing bugs for es-dev-server.

# es dev server

A web server for development without bundling.

```bash
npx es-dev-server --node-resolve --watch
```

**Quick overview**

- efficient browser caching for fast reloads
- [transform code on older browsers for compatibility](#compatibility-mode)
- [resolve bare module imports for use in the browser](#node-resolve) (`--node-resolve`)
- auto-reload on file changes with the (`--watch`)
- history API fallback for SPA routing (`--app-index index.html`)
- [plugin API for extensions](#plugins)

[See all commands](#command-line-flags-and-configuration)

## Getting started

We recommend [following this guide](https://dev.to/open-wc/developing-without-a-build-2-es-dev-server-1cf5) for a step by step overview of different workflows with `es-dev-server`.

## Setup

```bash
npm i --save-dev es-dev-server
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

## Command-line flags and Configuration

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
| cors      | boolean        | Enable CORS                                                             |
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
| event-stream         | boolean       | Whether to inject event stream script. Defaults to true.                                                                        |

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
  plugins: [],
  moduleDirs: ['node_modules', 'web_modules'],
};
```

In addition to the command-line flags, the configuration file accepts these additional options:

| name            | type    | description                                               |
| --------------- | ------- | --------------------------------------------------------- |
| middlewares     | array   | Koa middlewares to add to the server. (read more below)   |
| plugins         | array   | Plugins to add to the server. (read more below)           |
| babelConfig     | object  | Babel config to run with the server.                      |
| polyfillsLoader | object  | Configuration for the polyfills loader. (read more below) |
| debug           | boolean | Whether to turn on debug mode on the server.              |

## Serving files

es-dev-server is a static web server. When a request is made from the browser for `/foo/bar.js` it will try and find this file from the root directory. It cannot serve any files outside of your root directory because the browser has no way to request them, and the path on the file system must always be reflected in the path of the browser.

### index.html in the root

The simplest setup, making sure that all files are accessible, is to place your index.html at the root of your project

<details>
  <summary>Read more</summary>

Consider this example directory structure:

```
node_modules/...
src/...
index.html
```

If you run the `es-dev-server` command from the root of the project, you can access your app at `/` or `/index.html` in the browser.

</details>

### index.html in a folder

If you move your `index.html` outside the root of your project, you have some different options.

<details>
  <summary>Read more</summary>

Use the `--open` parameter for when you'd like to keep you index.html in a subfolder.

```
node_modules/...
src/...
src/index.html
```

You can access your app in the browser at `/src/` or `/src/index.html`. You can tell es-dev-server to explicitly open at this path:

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

If you want your index in a subfolder without this being visible in the browser URL, you can set up a file rewrite rule. [Read more here](#rewriting-request-urls)

</details>

### Monorepos

If you are using es-dev-server in a monorepo, your node modules are in two different locations. In a package's folder and at the repository root. You need to make sure that es-dev-server can serve from both directories.

<details>
  <summary>Read more</summary>

For example, a typical monorepo setup looks like this:

```
node_modules/...
packages/my-package/node_modules/...
packages/my-package/index.html
```

You will need to make sure the root node_modules folder is accessible to the dev server.

If your working directory is `packages/my-package` you can use this command:

```bash
# with app-index (for SPA)
es-dev-server --root-dir ../../ --app-index packages/my-package/index.html --open
# without app-index
es-dev-server --root-dir ../../ --open packages/my-package/index.html
```

If your working directory is the root of the repository you can use this command:

```bash
# with app index (for SPA)
es-dev-server --app-index packages/my-package/index.html --open
# without app index
es-dev-server --open packages/my-package/index.html
```

This is the same approach as serving an index.html in a subdirectory, so the section above applies here as well.

</details>

### Base Element

<details>
  <summary>Read more</summary>

If you are building a single page application with client-side routing, we recommend adding a base element to set the base URL of your document.

The base URL of the document can be accessed through `document.baseURI` and is used by the browser to resolve relative paths (anchors, images, links, scripts, etc.). By default, it is set to the browser's URL.

You can add `<base href="">` element to modify how files are resolved relatively to your index.html. This can be very useful when your index.html is not at the root of your project.

[Read more about this on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)

</details>

## Node resolve

"Bare imports" are imports which don't specify a full path to a file:

```js
import foo from 'bar';
```

The browser doesn't know where to find this file called `bar`. The `--node-resolve` flag resolves this bare import to the actual file path before serving it to the browser:

```js
import foo from './node_modules/bar/bar.js';
```

Because we use [es-module-lexer](https://github.com/guybedford/es-module-lexer) for blazing fast analysis to find the imports in a file without booting up a full-blown parser like babel, we can do this without a noticeable impact on performance.

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

In the future, we are hoping that [import maps](https://github.com/WICG/import-maps) will make this step unnecessary.

## Middleware

You can add your own middleware to es-dev-server using the `middlewares` property. The middleware should be a standard koa middleware. [Read more about koa here.](https://koajs.com/)

You can use middleware to modify respond to any request from the browser, for example to rewrite a URL or proxy to another server. For serving or manipulating files it's recommended to use plugins.

### Proxying requests

<details>
  <summary>Read more</summary>

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

### Rewriting request urls

You can rewrite certain file requests using a simple middleware. This can be useful for example to serve your `index.html` from a different file location or to alias a module.

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

## Plugins

Plugins are objects with lifecycle hooks called by es-dev-server as it serves files to the browser. They can be used to serve virtual files, transform files, or resolve module imports.

### Adding plugins

A plugin is just an object that you add to the `plugins` array in your configuration file. You can add an object directly, or create one from a function somewhere:

<details>
  <summary>Read more</summary>

```js
const awesomePlugin = require('awesome-plugin');

module.exports = {
  plugins: [
    // use a plugin
    awesomePlugin({ someOption: 'someProperty' }),
    // create an inline plugin
    {
      transform(context) {
        if (context.response.is('html')) {
          return { body: context.body.replace(/<base href=".*">/, '<base href="/foo/">') };
        }
      },
    },
  ],
};
```

</details>

See the full type interface for all options:

<details>
  <summary>Read more</summary>

```ts
import Koa, { Context } from 'koa';
import { FSWatcher } from 'chokidar';
import { Server } from 'net';
import { ParsedConfig } from './config';

type ServeResult = void | { body: string; type?: string; headers?: Record<string, string> };
type TransformResult = void | { body?: string; headers?: Record<string, string> };
type ResolveResult = void | string | Promise<void> | Promise<string>;

interface ServerArgs {
  config: ParsedConfig;
  app: Koa;
  server: Server;
  fileWatcher: FSWatcher;
}

export interface Plugin {
  serverStart?(args: ServerArgs): void | Promise<void>;
  serve?(context: Context): ServeResult | Promise<ServeResult>;
  transform?(context: Context): TransformResult | Promise<TransformResult>;
  resolveImport?(args: { source: string; context: Context }): ResolveResult;
  resolveMimeType?(context: Context): undefined | string | Promise<undefined | string>;
}
```

</details>

### Hook: serve

The serve hook can be used to serve virtual files from the server. The first plugin to respond with a body is used. It can return a Promise.

<details>
<summary>Read more</summary>

Serve an auto generated `index.html`:

```js
const indexHTML = generateIndexHTML();

module.exports = {
  plugins: [
    {
      serve(context) {
        if (context.path === '/index.html') {
          return { body: indexHTML };
        }
      },
    },
  ],
};
```

Serve a virtual module:

```js
const indexHTML = generateIndexHTML();

module.exports = {
  plugins: [
    {
      serve(context) {
        if (context.path === '/messages.js') {
          return { body: 'export default "Hello world";' };
        }
      },
    },
  ],
};
```

The file extension is used to infer the mime type to respond with. If you are using a non-standard file extension you can use the `type` property to set it explicitly:

```js
module.exports = {
  plugins: [
    {
      serve(context) {
        if (context.path === '/foo.xyz') {
          return { body: 'console.log("foo bar");', type: 'js' };
        }
      },
    },
  ],
};
```

</details>

### Hook: resolveMimeType

Browsers don't use file extensions to know how to interpret files. Instead, they use [media or MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) which is set using the `content-type` header.

es-dev-server guesses the MIME type based on the file extension. When serving virtual files with non-standard file extensions, you can set the MIME type in the returned result (see the examples above). If you are transforming code from one format to another, you need to use the `resolveMimeType` hook.

<details>
<summary>Read more</summary>

The returned MIME type can be a file extension, this will be used to set the corresponding default MIME type. For example `js` resolves to `application/javascript` and `css` to `text/css`.

```js
module.exports = {
  plugins: [
    {
      resolveMimeType(context) {
        // change all MD files to HTML
        if (context.response.is('md')) {
          return 'html';
        }
      },
    },
    {
      resolveMimeType(context) {
        // change all CSS files to JS, except for a specific file
        if (context.response.is('css') && context.path !== '/global.css') {
          return 'js';
        }
      },
    },
  ],
};
```

It is also possible to set the full mime type directly:

```js
module.exports = {
  plugins: [
    {
      resolveMimeType(context) {
        if (context.response.is('md')) {
          return 'text/html';
        }
      },
    },
  ],
};
```

</details>

### Hook: transform

The transform hook is called for each file and can be used to transform a file. Multiple plugins can transform a single file. It can return a Promise.

This hook is useful for small modifications, such as injecting environment variables, or for compiling files to JS before serving them to the browser.

If you are transforming non-standard file types, you may also need to include a `resolveMimeType` hook.

<details>
  <summary>Read more</summary>

Rewrite the base path of your application for local development;

```js
module.exports = {
  plugins: [
    {
      transform(context) {
        if (context.path === '/index.html') {
          const transformedBody = context.body.replace(/<base href=".*">/, '<base href="/foo/">');
          return { body: transformedBody };
        }
      },
    },
  ],
};
```

Inject a script to set global variables during local development:

```js
module.exports = {
  plugins: [
    {
      transform(context) {
        if (context.path === '/index.html') {
          const transformedBody = context.body.replace(
            '</head>',
            '<script>window.process = { env: { NODE_ENV: "development" } }</script></head>',
          );
          return { body: transformedBody };
        }
      },
    },
  ],
};
```

Inject environment variables into a JS module:

```js
const packageJson = require('./package.json');

module.exports = {
  plugins: [
    {
      transform(context) {
        if (context.path === '/src/environment.js') {
          return { body: `export const version = '${packageJson.version}';` };
        }
      },
    },
  ],
};
```

Transform markdown to HTML:

```js
const markdownToHTML = require('markdown-to-html-library');

module.exports = {
  plugins: [
    {
      resolveMimeType(context) {
        // this ensures the browser interprets .md files as .html
        if (context.path.endsWith('.md')) {
          return 'html';
        }
      },

      async transform(context) {
        // this will transform all MD files. if you only want to transform certain MD files
        // you can check context.path
        if (context.path.endsWith('.md')) {
          const html = await markdownToHTML(body);

          return { body: html };
        }
      },
    },
  ],
};
```

Polyfill CSS modules in JS:

```js
module.exports = {
  plugins: [
    {
      resolveMimeType(context) {
        if (context.path.endsWith('.css')) {
          return 'js';
        }
      },

      async transform(context) {
        if (context.path.endsWith('.css')) {
          const stylesheet = `
            const stylesheet = new CSSStyleSheet();
            stylesheet.replaceSync(${JSON.stringify(body)});
            export default stylesheet;
          `;

          return { body: stylesheet };
        }
      },
    },
  ],
};
```

</details>

### Hook: resolveImport

The `resolveImport` hook is called for each module import. It can be used to resolve module imports before they reach the browser.

<details>
  <summary>Read more</summary>

es-dev-server already resolves module imports when the `--node-resolve` flag is turned on. You can do the resolving yourself, or overwrite it for some files.

The hook receives the import string and should return the string to replace it with. This should be a browser-compatible path, not a file path.

```js
module.exports = {
  plugins: [
    {
      async resolveImport({ source, context }) {
        const resolvedImport = fancyResolveLibrary(source);
        return resolvedImport;
      },
    },
  ],
};
```

</details>

### Hook: serverStart

The `serverStart` hook is called when the server starts. It is the ideal location to boot up other servers you will proxy to. It receives the server config, which you can use if plugins need access to general information such as the `rootDir` or `appIndex`. It also receives the HTTP server, Koa app, and `chokidar` file watcher instance. These can be used for more advanced plugins. This hook can be async, and it awaited before actually booting the server and opening the browser.

<details>
<summary>Read more</summary>

Accessing the serverStart parameters:

```js
function myFancyPlugin() {
  let rootDir;

  return {
    serverStart({ config, app, server, fileWatcher }) {
      // take the rootDir to access it later
      rootDir = config.rootDir;

      // register a koa middleware directly
      app.use((context, next) => {
        console.log(context.path);
        return next();
      });

      // register a file to be watched
      fileWatcher.add('/foo.md');
    },
  };
}

module.exports = {
  plugins: [myFancyPlugin()],
};
```

Boot up another server for proxying in serverStart:

```js
const proxy = require('koa-proxies');

module.exports = {
  plugins: [
    {
      async serverStart({ app }) {
        // set up a proxy for certain requests
        app.use(
          proxy('/api', {
            target: 'http://localhost:9001',
          }),
        );

        // boot up the other server, because it is awaited es-dev-server will also wait for it
        await startOtherServer({ port: 9001 });
      },
    },
  ],
};
```

</details>

### Koa Context

The plugin hooks simply receive the Koa `Context` object. This contains information about the server's request and response. Check the [Koa documentation](https://koajs.com/) to learn more about this.

To transform specific kinds of files we don't recommend relying on file extensions. Other plugins may be using non-standard file extensions. Instead, you should use the server's MIME type or content-type header. You can easily check this using the `context.response.is()` function. This is used a lot in the examples above.

Because files can be requested with query parameters and hashes, we recommend using `context.path` for reading the path segment of the URL only. If you do need to access search parameters, we recommend using `context.URL.searchParams.get('my-parameter')`.

## Order of execution

The order of execution for the es-dev-server when a file request is received:

1. User middleware: before "next"
2. Serve
   - Plugins: serve
   - es-dev-server: static file middleware (if no plugin match)
3. Plugins: resolveMimeType
4. Plugins: transform
5. Resolve module imports
   - Plugins: resolveModuleImport
   - es-dev-server: node-resolve (if no plugin resolve)
6. es-dev-server: babel + compatibility transforms
7. es-dev-server: response cache (caches all JS files served, including plugin transforms)
8. User middleware: after "next"

## Typescript support

Because es-dev-server doesn't do any bundling, it's easy to integrate it with typescript and doesn't require any extra tooling or plugins. Just run `tsc` on your code, and serve the compiled output with es-dev-server. You can run both `tsc` and es-dev-server in watch mode, changes will be picked up automatically.

Make sure to configure `tsc` to output real ES modules.

## Compatibility mode

Compatibility mode enables bundle-free development using modern browsers features on older browsers. Automatic compatibility mode is enabled by default.

<details>

  <summary>Read more</summary>

Compatibility mode can be configured using the `--compatibility` flag. The possible options are `auto`, `min`, `max`, and `none`. The default is mode is `auto`.

**auto**
`auto` compatibility looks at the current browser to determine the level of compatibility to enable. On the latest 2 versions of the major browsers, it doesn't do any work. This keeps the server as fast as possible in the general case.

On older browsers, the server uses the browser's user agent and [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) to do a targeted transformation for that specific browser and version. `@babel/preset-env` only works with stage 4 javascript features, they should become an official standard before they can be used.

If the browser does not support es module scripts, dynamic imports or `import.meta.url` es modules are transformed to [system-js](https://github.com/systemjs/systemjs).

This works down to at least IE11. Depending on what browser features you are using, it might work with an earlier version too but this is not tested.

**always**
`always` compatibility is the same as `auto`, except that it doesn't skip compiling on the latest 2 versions of the major browsers. This makes it a bit slower on modern browsers but allows you to use new features before they are implemented in the browser.

**min**
`min` compatibility forces the same level of compatibility on all browsers. It makes code compatible with the latest two versions of the major browsers and does not transform es modules.

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

`createMiddlewares` and `createServer` requires a chokidar fileWatcher if watch mode is enabled. You need to pass this separately because the watcher nees-dev-server to be killed explicitly when the server closes.

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

`startServer` asynchronously creates and starts the server, listening on the configured port. It opens the browser if configured and logs a startup message.

Returns the koa app and a node http or http2 server.

```javascript
import Koa from 'koa';
import { createConfig, startServer } from 'es-dev-server';

async function main() {
  const config = createConfig({ ... });
  const { app, server } = await startServer(config, fileWatcher);
}

main();
```

</details>
