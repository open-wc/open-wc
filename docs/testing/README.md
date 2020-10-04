---
permalink: 'testing/index.html'
title: Testing
section: guides
tags:
  - guides
---

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

## Web Test Runner

For testing in the browser, we recommend [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/). With Web Test Runner, you can run unit tests on JavaScript code, as well as component tests on the rendered DOM elements.

See the [this guide](https://modern-web.dev/guides/test-runner/getting-started/) for a step by step guide how to set up the test runner.

## Testing libraries

When testing with web test runner, we recommend the following libraries:

- [mocha](https://mochajs.org/) for setting up the testing structure.
- [chai](https://www.chaijs.com/) for doing assertions
- [@open-wc/testing-helpers](https://open-wc.org/testing/testing-helpers.html) for setting up test fixtures and helper functions
- [@open-wc/semantic-dom-diff](https://open-wc.org/testing/semantic-dom-diff.html) for snapshot testing the rendered HTML
- [@open-wc/chai-axe-a11y](https://open-wc.org/testing/testing-chai-a11y-axe.html) for testing accessibility

To use these testing libraries, we recommend [@open-wc/testing](https://open-wc.org/testing/testing.html). This is an opinionated package that combines and configures many of these testing libraries, to minimize the amount of ceremony required to set up tests. For example, it exports chai with plugins already registered.

## Integration testing

A large part of the tests that are traditionally done with selenium can be done with Web Test Runner. However, there are still tests that should be run after an application has been deployed. We're still looking for good solutions here, help us improve this documentation by making a pull request!
