# karma-esm

Karma plugin for running tests with es modules on a wide range of browsers.

Out the box es modules don't work with karma because they dynamically request their dependencies, which karma doesn't allow.

The `karma-esm` plugin fixes this and spins up [es-dev-server](https://open-wc.org/developing/es-dev-server.html) behind the scenes. This lets you write tests using es mdodules, modern javascript syntax and features and have karma run them on all modern browsers and IE11.

`karma-esm` takes care of loading the correct polyfills, and runs babel for older browsers if necessary. On modern browsers missing module features, such as import maps, are shimmed using [es-module-shims](https://github.com/guybedford/es-module-shims). On browsers without es module support, modules are polyfilled with [system-js](https://github.com/systemjs/systemjs).

See [the es-dev-server docs](https://open-wc.org/developing/es-dev-server.html) for more details on compatibility with older browsers.

## Usage
We recommend the [testing-karma configuration](https://open-wc.org/testing/testing-karma.html) for a good default karma setup which includes `karma-esm` and many other good defaults.

### Manual setup
To manually setup this plugin, add it as a karma framework:

1. Install the plugin
`npm i --save @open-wc/karma-esm`

2. Add to your karma config
```javascript
{
  // define where your test files are, make sure to set type to module
  files: [
    { pattern: 'test/**/*.test.js' type: 'module' }
  ]

  plugins: [
    // load plugin
    require.resolve('@open-wc/karma-esm'),

    // fallback: resolve any karma- plugins
    'karma-*',
  ],

  frameworks: ['esm'],

  esm: {
    // if you don't use import maps, you will probably need node resolve
    nodeResolve: true,
    // set compatibility mode to all
    compatibility: 'all',
    compatibility: 'none',
  },
}
```

## Configuration
`karma-esm` can be configured with these options:

| name              |  type   | description                                                     |
| ----------------- | ------- | --------------------------------------------------------------- |
| nodeResolve       | boolean | Transforms bare module imports using node resolve.              |
| coverage          | boolean | Whether to report test code coverage.                           |
| importMap         | string  | Path to import map used for testing.                            |
| compatibility     | string  | Compatibility level to run the `es-dev-server` with.            |
| coverageExclude   | array   | Extra glob patterns of tests to exclude from coverage.          |
| customBabelConfig | string  | Custom babel configuration file to run on served code.          |
| moduleDirectories | string  | Directories to resolve modules from. Defaults to `node_modules` |
| babel             | boolean | Whether to pick up a babel configuration file in your project.  |
| fileExtensions    | array   | Custom file extensions to serve as es modules.                  |
| polyfills         | object  | Polyfill configuration.                                         |

### nodeResolve
Node resolve is necessary when you have 'bare imports' in your code, and are not using import maps to resolve them.

It transforms: `import foo from 'bar'` to: `import foo from './node_modules/bar/bar.js`.

### coverage
Due to a bug in karma, the test coverage reporter causes browser logs to appear twice which can be annoying

### compatibility
The compatibility option makes your code compatible with older browsers. It loads polyfills and transform modern syntax where needed. For testing it's best to leave this at 'none' for no modifications, or 'all' for full compatibility.

See [the documentation of the dev server](https://open-wc.org/developing/es-dev-server.html) for information on all the different modes.

## Karma preprocessors
Unfortunately, to make karma work with es modules regular karma preprocessors no longer work. You can however configure the `es-dev-server` to do code transoformations if needed.

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
  "presets": [
    "@babel/preset-typescript"
  ]
}
```

3. Configure your karma config to pick up your ts files:
```javascript
{
  files: [
    { pattern: '**/*.test.ts' }
  ],

  esm: {
    babel: true,
    nodeResolve: true,
    fileExtensions: ['.ts']
  },
}
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
