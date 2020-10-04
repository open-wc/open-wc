---
permalink: 'testing/testing-karma-bs.html'
title: Testing via Browserstack
section: guides
tags:
  - guides
---

> **Notice**
>
> We have stopped new development of this package.
>
> We will continue to support security patches and bug fixes, but we recommend [web test runner](https://modern-web.dev/docs/test-runner/overview/) for testing web component projects.

# Testing via Browserstack

Configuration for setting up browserstack testing with karma.

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

To make sure your project is production-ready, we recommend running tests in all the browsers you want to support.

If you do not have access to all browsers, we recommend using a service like [Browserstack](https://www.browserstack.com/) to make sure your project works as intended.
Browserstack offers free accounts for [open source projects](https://www.browserstack.com/open-source).

The `testing-karma-bs` configuration helps setting up karma with Browserstack. To set it up you need to use the configuration in your project, and follow the instructions below to set up a user account

## Setup

With our project scaffolding you can set up a pre-configured project, or you can upgrade an existing project by choosing `Upgrade -> Testing`:

```bash
npm init @open-wc
```

### Manual

Install:

```bash
npm i -D @open-wc/testing-karma-bs deepmerge
```

Add a `karma.conf.bs.js` file:

```javascript
const merge = require('deepmerge');
const { bsSettings } = require('@open-wc/testing-karma-bs');
const createBaseConfig = require('./karma.conf.js');

module.exports = config => {
  config.set(
    merge.all([
      bsSettings(config),
      createBaseConfig(config),
      {
        browserStack: {
          project: 'your-name',
        },
      },
    ]),
  );

  return config;
};
```

Add a script to your `package.json`:

```json
{
  "scripts": {
    "test:bs": "karma start karma.conf.bs.js --coverage"
  }
}
```

### Setup user + key

- Go to [https://www.browserstack.com/accounts/settings](https://www.browserstack.com/accounts/settings)
- Look for "Automate" and write down your "Access Key" and "Username"
- Within your terminal or command line write:

```bash
# for one-time use only (on mac)
export BROWSER_STACK_USERNAME=xxx
export BROWSER_STACK_ACCESS_KEY=xxx

# or for one-time use only (on windows)
set BROWSER_STACK_USERNAME=xxx
set BROWSER_STACK_ACCESS_KEY=xxx

# or add them to your .bashrc
echo "export BROWSER_STACK_USERNAME=xxx" >> ~/.bashrc
echo "export BROWSER_STACK_ACCESS_KEY=xxx" >> ~/.bashrc

# to verify, run:
echo "User: $BROWSER_STACK_USERNAME"
echo "Key: $BROWSER_STACK_ACCESS_KEY"
```

### Usage

```bash
npm run test:bs
```
