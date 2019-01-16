# Testing

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

Open Web Components provides a set of defaults, recommendations and tools to help facilitate your Web Component. Our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

We believe that testing is fundamental to every production-ready product.

We recommend using [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development)(Behavior Driven Development) as it seem to be easier when talking to non tech collegues. However note that this can still be a personal preference - we give this recommendation to promote unity within everyone using this recommendation.

Using:
- System via [mocha](https://mochajs.org/)
- Assertions via [chai](https://www.chaijs.com/)
  - Plugin [chai-dom-equals](https://www.npmjs.com/package/@open-wc/chai-dom-equals)
- Mocks via [sinon](https://sinonjs.org/)

::: tip Info
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

## Setup
```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:testing'

# or if you already have a Web Component project set up and/or test files
npx -p yo -p generator-open-wc -c 'yo open-wc:testing-upgrade'
```

This will run the setup for multiple packages (testing-bare, testing-karma, testing-karma-bs).

::: tip Note
If you want to use your own test runner you can use `npx -p yo -p generator-open-wc -c 'yo open-wc:testing-bare'`
::::

### Manual
```bash
yarn add @open-wc/testing --dev
```

Add to your test:
```js
import { expect } from '@open-wc/testing';
```

This will have the following side effects:
  - Use the plugin [chai-dom-equals](https://www.npmjs.com/package/@open-wc/chai-dom-equals)
  - Enables cleanup after each test for all `fixture`s

## Automating Tests
Ideally, you'll want some way of automatically running all of your tests. To do that, we recommend karma via `@open-wc/testing-karma` and browserstack via `@open-wc/testing-karma-bs`.  
If you use a different test runner or a different browser grid you may skip these steps.

::: tip Note
Already part of `yo open-wc:testing`
::::

### Manual Install
- Install via `yarn add @open-wc/testing-karma --dev`
- Copy [karma.conf.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/testing-karma/templates/static/karma.conf.js) to `karma.conf.js`
- Add these scripts to package.json
  ```js
  "scripts": {
    "test": "karma start",
    "test:watch": "karma start --auto-watch=true --single-run=false",
    "test:es5": "karma start karma.es5.config.js",
    "test:es5:watch": "karma start karma.es5.config.js --auto-watch=true --single-run=false",
  },
  ```

For more details, please see [testing-karma](https://open-wc.org/testing/testing-karma.html).

## Automating Tests via Browserstack
To make sure your project is production ready, we recommend running tests in all the browsers you want to support.
If you do not have access to all browsers, we recommend using a service like [Browserstack](https://www.browserstack.com/) to make sure your project works as intended.

The following step connects the automatic karma runner with browserstack.

::: tip Note
Already part of `yo open-wc:testing`
::::

### Manual Install

- Install via `yarn add @open-wc/testing-karma-bs --dev`
- Copy [karma.es5.bs.config.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/testing-karma-bs/templates/static/karma.es5.bs.config.js) to `karma.es5.bs.config.js`
- Add these scripts to your package.json
  ```js
  "scripts": {
    "test:es5:bs": "karma start karma.es5.bs.config.js"
  },
  ```

For more details, please see [testing-karma-bs](https://open-wc.org/testing/testing-karma-bs.html).

## Example Tests

A typical Web Component test will look something like this:

```js
/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  expect,
} from '@open-wc/testing';

import '../src/get-result.js';

describe('True Checking', () => {
  it('is false by default', async () => {
    const el = await fixture('<get-result></get-result>');
    expect(el.success).to.be.false;
  });

  it('false values will have a light-dom of <p>NOPE</p>', async () => {
    const el = await fixture('<get-result></get-result>');
    expect(el).dom.to.equal('<get-result><p>NOPE</p></get-result>');
  });

  it('true values will have a light-dom of <p>YEAH</p>', async () => {
    const foo = 1;
    const el = await fixture(html`<get-result .success=${foo === 1}></get-result>`);
    expect(el.success).to.be.true;
    expect(el).dom.to.equal('<get-result><p>YEAH</p></get-result>');
  });
});
```

If you run your tests automatically with `npm run test`, the output should look like this:

```
> karma start demo/karma.conf.js
START:
Webpack bundling...
Hash: 268cd16a4849f1191bd5
Version: webpack 4.26.1
Time: 1590ms
Built at: 12/18/2018 2:01:09 PM
             Asset       Size           Chunks             Chunk Names
        commons.js   1.93 MiB          commons  [emitted]  commons
get-result.test.js  337 bytes  get-result.test  [emitted]  get-result.test
        runtime.js   14.2 KiB          runtime  [emitted]  runtime
Entrypoint get-result.test = runtime.js commons.js get-result.test.js
18 12 2018 14:01:10.156:INFO [karma-server]: Karma v3.1.3 server started at http://0.0.0.0:9876/
18 12 2018 14:01:10.160:INFO [launcher]: Launching browsers ChromeHeadlessNoSandbox with concurrency unlimited
18 12 2018 14:01:10.166:INFO [launcher]: Starting browser ChromeHeadless
18 12 2018 14:01:10.833:INFO [HeadlessChrome 70.0.3538 (Windows 10.0.0)]: Connected on socket 6PnebgDwW91bPrHzAAAA with id 55371387
  True Checking
    ✔ is false by default
    ✔ false values will have a light-dom of <p>NOPE</p>
    ✔ true values will have a light-dom of <p>YEAH</p>
Finished in 0.12 secs / 0.029 secs @ 14:01:11 GMT+0100 (GMT+01:00)
SUMMARY:
✔ 3 tests completed
TOTAL: 3 SUCCESS
=============================== Coverage summary ===============================
Statements   : 100% ( 8/8 )
Branches     : 100% ( 2/2 )
Functions    : 100% ( 3/3 )
Lines        : 100% ( 8/8 )
================================================================================
```

::: tip Note
Make sure you have Chrome (or Chromium) installed.
Additionally you may need to set your CHROME_BIN env variable `export CHROME_BIN=/usr/bin/chromium-browser`.
::::

For some example tests, please take a look at our [Set-Game Example Test Files](https://github.com/open-wc/example-vanilla-set-game/tree/master/test).
