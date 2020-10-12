# Developing Components >> Testing ||30

If you choose the testing option in the project generator it will scaffold some example tests for your component.

## Web Test Runner

We recommend [@web/test-runner](https://modern-web.dev/docs/test-runner/overview/) for testing web components. It's based on `@web/dev-server`, following the same approach using native es modules, and runs tests in a real browser.

## Running the tests

To run the tests, execute this command:

```
npm run test
```

This will run the tests in a locally installed Chrome browser. There are many other browser options in Web Test Runner as well.

To run the tests in watch mode, execute this command:

```
npm run test:watch
```

This will keep the test runner open. Editing files will re-run the associated tests.

## Step by step guide

[Follow this guide](https://modern-web.dev/guides/test-runner/getting-started/) for a full step by step guide on using Web Test Runner
