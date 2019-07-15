# Testing

[//]: # (AUTO INSERT HEADER PREPUBLISH)

We believe that testing is fundamental to every production-ready product.

We recommend using [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development)(Behavior Driven Development) as it seem to be easier when talking to non tech collegues. However note that this can still be a personal preference - we give this recommendation to promote unity within everyone using this recommendation.

Using:
- System via [mocha](https://mochajs.org/)
- Assertions via [chai](https://www.chaijs.com/)
  - Plugin [chai-dom-equals](https://www.npmjs.com/package/@open-wc/chai-dom-equals)
- Mocks via [sinon](https://sinonjs.org/)

## Setup
```bash
npm init @open-wc
# Upgrade > Testing
```

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
Already part of `npm init @open-wc testing`
::::

### Manual Install
Read more at [testing-karma](https://open-wc.org/testing/testing-karma.html)

## Automating Tests via Browserstack
To make sure your project is production ready, we recommend running tests in all the browsers you want to support.
If you do not have access to all browsers, we recommend using a service like [Browserstack](https://www.browserstack.com/) to make sure your project works as intended.

The following step connects the automatic karma runner with browserstack.

::: tip Note
Already part of `npm init @open-wc testing`
::::

### Manual Install
Read more at [testing-karma-bs](https://open-wc.org/testing/testing-karma-bs.html)

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

## Fixture Cleanup
By default, if you import anything via `import { ... } from '@open-wc/testing-helpers';`, it will automatically register a side-effect that cleans up your fixtures.
If you want to be in full control you can do so by using
```js
import { fixture, fixtureCleanup } from '@open-wc/testing/index-no-side-effects.js';

it('can instantiate an element with properties', async () => {
  const el = await fixture(html`<my-el .foo=${'bar'}></my-el>`);
  expect(el.foo).to.equal('bar');
  fixtureCleanup();
}

// Alternatively, you can add the fixtureCleanup in the afterEach function.
// Note that this is exactly what the automatically registered side-effect does.
afterEach(() => {
  fixtureCleanup();
});
```

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/testing/README.md';
      }
    }
  }
</script>
