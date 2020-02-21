# Testing

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

Testing is an important part of any software project. We have collected a set of libraries, tools and best practices to get you started with testing.

Our setup is aimed specifically at working with minimal tooling, using the native es module loader of the browser just like our [developing setup](https://open-wc.org/developing/). We have special helper functions available for testing web components, but our setup works without web components as well.

## Setup

The easiest way to set up testing in your project is to use our project scaffolding. You can use this to create a new project or to upgrade an existing project:

```bash
npm init @open-wc
```

### Manual setup

To set up testing in your project manually, you will need to follow the instructions of the separate tools and packages below.

## Step by step guide

To help you get started with testing, we recommend [reading this article](https://dev.to/open-wc/testing-workflow-for-web-components-g73) for a great step by step guide.

## Karma

For testing in the browser, we recommend [Karma](https://karma-runner.github.io/latest/index.html). With Karma, you can run unit tests for our javascript, as well as component tests on the rendered dom elements.

See the [testing-karma page](https://open-wc.org/testing/testing-karma.html) to learn how to set this up with our default configuration.

## Testing libraries

When testing with karma, we recommend the following libraries:

- [mocha](https://mochajs.org/) for setting up the testing structure.
- [chai](https://www.chaijs.com/) for doing assertions
- [sinon](https://open-wc.org/testing/testing-sinon.html) for mocks, spies and stubs
- [@open-wc/testing-helpers](https://open-wc.org/testing/testing-helpers.html) for setting up test fixtures and helper functions
- [@open-wc/semantic-dom-diff](https://open-wc.org/testing/semantic-dom-diff.html) for snapshot testing the rendered HTML
- [@open-wc/chai-axe-a11y](https://open-wc.org/testing/testing-chai-a11y-axe.html) for testing accessibility

To use these testing libraries, we recommend [@open-wc/testing](https://open-wc.org/testing/testing.html). This is an opinionated package that combines and configures many of these testing libraries, to minimize the amount of ceremony required to set up tests. For example, it exports chai with plugins already registered.

## Cross-browser testing

To make sure your project is production-ready, we recommend running tests in all the browsers you want to support. If you do not have access to all browsers, we recommend using a service like [Browserstack](https://www.browserstack.com/) to make sure your project works as intended.

Read more at [testing-karma-bs](https://open-wc.org/testing/testing-karma-bs.html) to learn how to set this up with karma.

## Integration testing

A large part of the tests that are traditionally done with selenium can be done with Karma. However, there are still tests that should be run after an application has been deployed. We're still looking for good solutions here, help us improve this documentation by making a pull request!
