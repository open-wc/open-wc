# Developing Components >> Going Buildless ||20

Browsers have improved a lot over the past years. It's now possible to do web development without requiring any build tools, using the native module loader of the browser. We think this is a great fit for web components, and we recommend this as a general starting point.

Build tools can quickly add a lot of complexity to your code, and make your code reliant on a specific build setup. We think it's best to avoid them during development, or only add them for light transformations if you know what you're doing.

## Dev Server

Because web components are based on native browser APIs, you could use any simple web server for development.

We recommend `@web/dev-server` which comes with the project generator. It adds useful developer productivity features, such as a watch mode, caching, and a plugin API. Check the [official docs](https://modern-web.dev/docs/dev-server/overview/) for more information on the dev server.

## Running the server

To run the server inside your project, execute this command:

```
npm start
```

This will open a browser with a demo of your component.

The demo is served from the `demo/index.html` file. If you edit this file or any other file served from the web server, the browser will be reloaded automatically.

## Bare module imports

A common practice in javascript projects is to use so-called "bare module imports". These are imports statement which specifies only the name of the package, or a file inside the package.

For example:

```js
import foo from 'foo';
```

Imports such as this are useful when dependencies in your `node_modules` folder need to reference other packages. We this in the generator project as well.

Unfortunately, the browser does not understand this style of imports today and require some form of preprocessing to resolve the imports to reference the actual file location. Luckily `@web/dev-server` can handle this for us using the `--node-resolve` option.

In the future, something like [import maps](https://github.com/WICG/import-maps) will allow the browser to understand these kinds of imports without requiring a transforming step.
