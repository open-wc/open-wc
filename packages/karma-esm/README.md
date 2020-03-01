# karma-esm

Karma plugin for running tests with es modules on a wide range of browsers.

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

Out the box es modules don't work with karma because they import their dependencies from the browser, while karma doesn't allow requesting any files it doesn't know about upfront.

The `karma-esm` plugin fixes this and spins up [es-dev-server](https://open-wc.org/developing/es-dev-server.html) behind the scenes. This lets you write tests using es modules, modern javascript syntax and features, and have karma run them on all modern browsers and IE11.

`es-dev-server` takes care of loading the correct polyfills, and runs babel for older browsers if necessary. On browsers which don't support es modules, dynamic imports and/or import.meta.url, [systemjs](https://github.com/systemjs/systemjs) is used as a module polyfill.

See [the es-dev-server docs](https://open-wc.org/developing/es-dev-server.html) for full details on how it works.

## Usage

We recommend the [testing-karma configuration](https://open-wc.org/testing/testing-karma.html) for a good default karma setup which includes `karma-esm` and many other good defaults.

### Manual setup

To manually set up this plugin, add it as a karma framework:

1. Install the plugin

```bash
npm i -D @open-wc/karma-esm
```

2. Add to your karma config

```javascript
module.exports = {
  // define where your test files are, make sure to set type to module
  files: [
    { pattern: 'test/**/*.test.js', type: 'module' }
  ]

  plugins: [
    // load plugin
    require.resolve('@open-wc/karma-esm'),

    // fallback: resolve any karma- plugins
    'karma-*',
  ],

  frameworks: ['esm'],

  esm: {
    // if you are using 'bare module imports' you will need this option
    nodeResolve: true,
  },
}
```

## Configuration

`karma-esm` can be configured with these options:

| name             | type          | description                                                                                                   |
| ---------------- | ------------- | ------------------------------------------------------------------------------------------------------------- |
| nodeResolve      | boolean       | Transforms bare module imports using node resolve.                                                            |
| dedupe           | boolean/array | Deduplicates all modules, or modules from specified packages if the value is an array                         |
| coverage         | boolean       | Whether to report test code coverage.                                                                         |
| importMap        | string        | Path to import map used for testing.                                                                          |
| compatibility    | string        | Compatibility level to run the `es-dev-server` with.                                                          |
| coverageExclude  | array         | Extra glob patterns of tests to exclude from coverage.                                                        |
| babelConfig      | string        | Custom babel configuration file to run on served code.                                                        |
| moduleDirs       | array         | Directories to resolve modules from. Defaults to `node_modules`                                               |
| babel            | boolean       | Whether to pick up a babel configuration file in your project.                                                |
| fileExtensions   | array         | Custom file extensions to serve as es modules.                                                                |
| polyfillsLoader  | object        | Configuration for the polyfills loader                                                                        |
| devServerPort    | number        | Port of server that serves the modules. Note that this is not the karma port. Picks a random port if not set. |
| preserveSymlinks | boolean       | Run the `es-dev-server` with the `--preserve-symlinks` option.                                                |

### nodeResolve

Node resolve is necessary when you have 'bare imports' in your code and are not using import maps to resolve them.

It transforms: `import foo from 'bar'` to: `import foo from './node_modules/bar/bar.js`.

See the [node-resolve documentation of es-dev-server](https://open-wc.org/developing/es-dev-server.html#node-resolve) for more information.

### dedupe

Deduplicate packages, ensuring only one version of a package is resolved.

See the [dedupe documentation of es-dev-server](https://open-wc.org/developing/es-dev-server.html#dedupe) for more information.

### coverage

Due to a bug in karma, the test coverage reporter causes browser logs to appear twice which can be annoying

### importMap

Allows to control the behavior of ES imports according to the (in progress) [spec](https://github.com/WICG/import-maps).
Since this feature is not enabled by default, is necessary to launch Chrome with `--enable-experimental-web-platform-features` flag.

In karma.config.js add:

```js
customLaunchers: {
  ChromeHeadlessNoSandbox: {
    base: 'ChromeHeadless',
    flags: [
      '--no-sandbox', //default karma-esm configuration
      '--disable-setuid-sandbox', //default karma-esm configuration
      '--enable-experimental-web-platform-features' // necessary when using importMap option
    ],
  },
}
```

### compatibility

The compatibility option makes your code compatible with older browsers. It loads polyfills and transforms modern syntax where needed.

See the [compatibility documentation of es-dev-server](https://open-wc.org/developing/es-dev-server.html#compatibility-mode) for more information.

### preserveSymlinks

The `es-dev-server` by default resolves the symlinks in the dependency directory. This can cause problem when you're using `npm link` command or other tools which rely on them. This option will make `es-dev-server` preserve symlinks.

## Karma preprocessors

Unfortunately, to make karma work with es modules regular karma preprocessors no longer work. You can, however, configure the `es-dev-server` to do code transformations if needed.

## Custom babel plugins

You can configure `karma-esm` to pick up the babel configuration files in your project:

```javascript
{
  esm: {
    babel: true
  },
}
```

## Testing typescript

The simplest way to test typescript is to compile your typescript to javascript before running tests. Just run `tsc` in watch mode and include the compiled js files from your karma config.

You can also configure `karma-esm` to run your typescript files directly. This is done by running it with a babel plugin to compile your typescript files to javascript.

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

3. Configure your karma config to pick up your ts files:

```javascript
{
  files: [
    { pattern: 'test/**/*.test.ts', type: 'module' }
  ],

  esm: {
    babel: true,
    nodeResolve: true,
    fileExtensions: ['.ts']
  },
}
```

To add support for experimental features that are normally handled by the typescript compiler, you can add extra plugins:

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

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/karma-esm/README.md';
      }
    }
  }
</script>
