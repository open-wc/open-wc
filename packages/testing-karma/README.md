# Testing with Karma

[//]: # (AUTO INSERT HEADER PREPUBLISH)

## Browser testing
Web Components are at the cutting edge of browser support. Testing solutions that run a simulated browser are often not suitable due to missing features. We therefore recommend running tests in a real browser. With headless Chrome and Firefox this is very convenient to set up and use, and will give more testing confidence as you can run the same tests across multiple browsers.

Karma is a solid tool for running tests in the browser.

## Types of tests
Karma can be used both for running unit tests, as well as for running more complex e2e/integration tests.

## Karma config presets
Configuration should be customized per project, We provide a preset that can be used as a starting point. You can copy paste the preset into your own project for full control, or you can extend them and add your project specific requirements.

The intention of the presets is to be able to write browser runnable code, with some exceptions such as bare module imports.

### Features
- Runs tests as plain es modules
- Serves static files
- Runs tests through mocha
- Deep object diffs in mocha errors
- Handles bare import specifiers
- Test coverage through instanbul when passing the `coverage` flag
- Supports older browsers (down to IE11) when passing the `legacy` flag

::: tip
This is part of the default [open-wc testing](https://open-wc.org/testing/) recommendation
:::

### Setup
```bash
npm init @open-wc
# Upgrade > Testing
```

For manual setup, follow the steps at the bottom of this readme.

### Workflow

Commands explained:
- `test`: does a single test run on the configured browsers (default headless chrome) and prints tests and coverage results.
- `test:watch`: does a single test run, and then re-runs on file changes. coverage is not analyzed for performance. in watch mode you can also debug in the browser, which is very convenient. visit http://localhost:9876/debug.html
- `test:legacy`: like `test`, except that it compiles your code to es5 and adds [babel](https://babeljs.io/docs/en/babel-polyfill) and [web component](https://github.com/webcomponents/webcomponentsjs) polyfills for maximum compatibility.
- `test:legacy:watch`: like `test:watch`, adding the same mentioned polyfills
- `test:update-snapshots`: updates any snapshots files from `@open-wc/semantic-dom-diff`. Use this when your component's rendered HTML changed.
- `test:prune-snapshots`: prunes any used snapshots files from `@open-wc/semantic-dom-diff`.

### Testing single files or folders
By default karma runs all your test files. To test a single file or folder, use the `--grep` flag. (If you did a manual setup, makes sure your config handles this flag).

Pass which files to test to the grep flag: `npm run test -- --grep test/foo/bar.test.js`.

### Watch mode
Use `npm run test -- --auto-watch=true --single-run=false` to keep karma running. Any code changes will trigger a re-run of your tests.

### Debugging in the browser
While testing, it can be useful to debug your tests in a real browser so that you can use the browser's dev tools.

Use `npm run test:watch` to keep karma running. Then open the URL printed by karma when it boots up. By default this is `http://localhost:9876/`. Click the debug button in the top right corner, or go directly to `http://localhost:9876/debug.html`.

You can bookmark this page for easy access.

Adding `debugger` statements will allow you to debug using the browser's dev tools.

### Testing on older browsers
The default karma setup will work on any browsers supporting web component and `es2015`+ syntax. This is to ensure your tests run as fast as possible, with minimum processing.

At the time of writing, this means it will work on the latest versions of Chrome, Safari and Firefox. You can run your tests with the `--legacy` flag to trigger legacy mode, which compile your code to `es5` and add the necessary web component polyfills. This will make your tests work as far back as IE 11.

If you use browser features which are not yet supported in Chrome, Safari or Firefox you will similarly need to pass the `--legacy` flag to run your tests. A good workflow here can be to only work with features supported by at least one browser, and use that browser to develop your tests. Then only run tests on all browsers when you finish development.

### Manual setup
For a minimal setup, extend the base config and specify where your tests are:

- Install the required dependencies:
```bash
npm i --save @open-wc/testing-karma webpack-merge karma
```

- Create a `karma.conf.js`
  ```js
  const createDefaultConfig = require('@open-wc/testing-karma/default-config.js');
  const merge = require('webpack-merge');

  module.exports = config => {
    config.set(
      merge(createDefaultConfig(config), {
        files: [
          // runs all files ending with .test in the test folder,
          // can be overwritten by passing a --grep flag. examples:
          //
          // npm run test -- --grep test/foo/bar.test.js
          // npm run test -- --grep test/bar/*
          { pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' }
        ],
      }),
    );
    return config;
  };
  ```
  <details>
    <summary>Extending the config</summary>

    To extend the karma config, we recommend using `webpack-merge`. This will do smart merging of complex objects. You can extend any of the configuration. For example to set your own test coverage:

    ```js
    const createDefaultConfig = require('@open-wc/testing-karma/default-config.js');
    const merge = require('webpack-merge');

    module.exports = config => {
      config.set(
        merge(createDefaultConfig(config), {
          files: [
            // runs all files ending with .test in the test folder,
            // can be overwritten by passing a --grep flag. examples:
            //
            // npm run test -- --grep test/foo/bar.test.js
            // npm run test -- --grep test/bar/*
            { pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' }
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

  </details>

  <details>
    <summary>Replacing Default Settings Instead of Merging</summary>

    In some cases you'll want `your custom config` to include config values that replace, rather than extend, the defaults provided. To make this possible you can make advanced usage of webpack-merge to set a [merge strategy](https://github.com/survivejs/webpack-merge#mergestrategy-field-prependappendreplaceconfiguration-configuration) to follow when joining the defaults and your custom config. See below for an example that uses `replace` to change the `reports` used by `coverageIstanbulReporter`.

    ```js
    module.exports = config => {
      config.set(
        merge.strategy(
          {
            'coverageIstanbulReporter.reports': 'replace',
          }
        )(defaultSettings(config), {
          files: [
            // allows running single tests with the --grep flag
            { pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' }
          ],
          // your custom config
          coverageIstanbulReporter: {
            reports: ['html', 'lcovonly', 'text']
          }
        })
      );
      return config;
    };
    ```
  </details>

- If you only want to run tests on modern browsers, add these scripts:
```json
"scripts": {
  "test": "karma start --coverage",
  "test:watch": "karma start --auto-watch=true --single-run=false",
  "test:update-snapshots": "karma start --update-snapshots",
  "test:prune-snapshots": "karma start --prune-snapshots"
},
```
- If you want to run tests on legacy browsers as well, add these scripts:
```json
"scripts": {
  "test": "karma start --coverage",
  "test:watch": "karma start --auto-watch=true --single-run=false",
  "test:update-snapshots": "karma start --update-snapshots",
  "test:prune-snapshots": "karma start --prune-snapshots",
  "test:legacy": "karma start --legacy --coverage",
  "test:legacy:watch": "karma start --legacy --auto-watch=true --single-run=false"
},
```
- Run via `npm run <command>`

- See the top of the readme for workflow recommendations.

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
