# Testing with Karma

Configuration for setting up testing with karma.

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

We recommend karma as a general-purpose tool for testing code that runs in the browser. Karma can run a large range of browsers, including IE11. This way you are confident that your code runs correctly in all supported environments.

During development you can run Chrome Headless, giving fast feedback in the terminal while writing your tests. In your CI you can run more browsers, and/or use a service like [Browserstack](https://www.browserstack.com/) or [Saucelabs](https://saucelabs.com/) for testing in all supported browsers.

Karma can be used both for running unit tests, as well as for running more complex e2e/integration tests in the DOM.

## Getting started

Our configuration sets up karma to run tests based on es modules with the necessary polyfills and fallbacks for older browsers and convenient test reporting.

This page explains how to set up `karma`, see the [testing overview](https://open-wc.org/testing/) for guides and libraries to get started with testing in general.

### Features

- Runs tests with es modules
- Serves static files
- Runs tests through mocha
- Deep object diffs in mocha errors
- Test coverage through instanbul when passing the `coverage` flag
- Supports older browsers (down to IE11)

## Setup

With our project scaffolding you can set up a pre-configured project, or you can upgrade an existing project by choosing `Upgrade -> Testing`:

```bash
npm init @open-wc
```

### Manual

Install:

```bash
npm i -D @open-wc/testing-karma deepmerge karma
```

Create a `karma.conf.js`:

```js
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        { pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' },
      ],

      // see the karma-esm docs for all options
      esm: {
        // if you are using 'bare module imports' you will need this option
        nodeResolve: true,
      },
    }),
  );
  return config;
};
```

Add scripts to your package.json:

```json
{
  "scripts": {
    "test": "karma start --coverage",
    "test:watch": "karma start --auto-watch=true --single-run=false",
    "test:update-snapshots": "karma start --update-snapshots",
    "test:prune-snapshots": "karma start --prune-snapshots"
  }
}
```

## Workflow

Commands explained:

- `test`: does a single test run on the configured browsers (default headless chrome) and prints tests and coverage results.
- `test:watch`: does a single test run, and then re-runs on file changes. coverage is not analyzed for performance. in watch mode you can also visit http://localhost:9876/debug.html to debug in the browser
- `test:update-snapshots`: updates any snapshots files from `@open-wc/semantic-dom-diff`. Use this when your component's rendered HTML changed.
- `test:prune-snapshots`: prunes any used snapshots files from `@open-wc/semantic-dom-diff`.

## Testing single files or folders

By default, karma runs all your test files. To test a single file or folder, use the `--grep` flag. (If you did a manual setup, makes sure your config handles this flag).

Pass which files to test to the grep flag: `npm run test -- --grep test/foo/bar.test.js`.

## Debugging in the browser

While testing, it can be useful to debug your tests in a real browser so that you can use the browser's dev tools.

Use `npm run test:watch` to keep karma running. Then open the URL printed by karma when it boots up. By default, this is `http://localhost:9876/`. Click the debug button in the top right corner, or go directly to `http://localhost:9876/debug.html`.

You can bookmark this page for easy access.

Adding `debugger` statements will allow you to debug using the browser's dev tools.

## Testing on older browsers

Testing on older browsers is powered by es-dev-server's compatibility mode.

See the [compatibility documentation of es-dev-server](https://open-wc.org/developing/es-dev-server.html#compatibility-mode) for more information.

## Testing on WSL (Windows Subsystem for Linux)

Currently Chrome Headless has issues on WSL.
Until they are fixed, you can work around it by pointing your CHROME_BIN variable to your Windows installation of chrome instead of chromium inside your linux distro.
This works because with WSL, you can use executables between environments.

```bash
export CHROME_BIN=/mnt/c/Program\ Files\ \(x86\)/Google/Chrome/Application/chrome.exe
```

## Why don't you recommend testing tool X?

Sometimes people ask why we recommend Karma and not other popular testing tools. We're always on the lookout for improving our recommendations, so if you think we can do better please let us know. What's important for us is that the testing tool is robust, simple to use, does not require any building, and runs in a real browser.

Testing tools that don't use a real browser but something like JSDOM constantly need to keep up with the latest browser standards, so you need to wait for your testing tool to update before you can use a new feature. It doesn't give the same confidence as testing in a real browser, and with Headless Chrome and Puppeteer it hardly seems necessary anymore.

## Extending the config

To extend the karma config, we recommend using `deepmerge`. This will do smart merging of complex objects. You can extend any of the configuration. For example to set your own test coverage threshold:

```js
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = config => {
  config.set(
    deepmerge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        { pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' },
      ],

      coverageIstanbulReporter: {
        thresholds: {
          global: {
            statements: 50,
            lines: 50,
            branches: 50,
            functions: 50,
          },
        },
      },
    }),
  );
  return config;
};
```

### Custom babel plugins

`karma-esm` supports custom babel configurations. [Check out the documentaton](https://open-wc.org/testing/karma-esm.html) for more information.

### Typescript

Because `karma-esm` doesn't do any bundling, it is compatible with typescript out of the box. [Check out the documentaton](https://open-wc.org/testing/karma-esm.html) for more information.

### Testing in a monorepository

When testing without a bundler you will be serving every imported module straight from the file system. Karma cannot serve files outside the path of the webserver, which by default starts from the directory of your karma config.

In a monorepo dependencies are often two levels higher in the root of the repository. To run tests in a monorepository you either have to put your config in the root of the repository, or adjust the basePath in your karma config:

```js
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [{ pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' }],

      basePath: '../../',
    }),
  );
  return config;
};
```

### Preserving symlinks

When using a tool that relies on symlinks such as `npm link` or `lerna`, the `es-dev-server` that runs under the hood of `karma-esm` plugin needs to run with `--preserve-symlinks` option.

You can pass this option via the `esm` plugin configuration:

```js
  ...
  esm: {
    nodeResolve: true,
    preserveSymlinks: true,
  },
  ...
```

[Check out the documentaton](https://open-wc.org/testing/karma-esm.html) for more information.

### Other configuration

`karma-esm` is the plugin powering our configuration, and it supports a few more for advanced use cases. [Check out the documentaton](https://open-wc.org/testing/karma-esm.html) for more information.

```js
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [{ pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' }],

      basePath: '../../',
    }),
  );
  return config;
};
```

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/testing-karma/README.md';
      }
    }
  }
</script>
