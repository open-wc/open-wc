# Testing

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

We want to provide a good set of defaults on how to facilitate your web component.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Having tests should be the fundament of every production ready product.

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
npx -p yo -p generator-open-wc -c 'yo open-wc:testing-bare'
```

### Manual
```bash
yarn add @open-wc/testing --dev
```

Add to your test:
```js
import { expect } '@open-wc/testing';
```

This will have the following side effect:
  - use the plugin [chai-dom-equals](https://www.npmjs.com/package/@open-wc/chai-dom-equals)
  - enables cleanup after each test for `fixture` and `litFixture`

## Example

A typical webcomponent test will look something like this:

```js
/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  litFixture,
  expect,
} from '@open-wc/testing';

describe('True Checking', () => {
  it('is false by default', async () => {
    const el = await fixture('<is-true></is-true>');
    expect(el.result).to.be.false;
  });

  it('false values will have a light-dom of <p>NOPE</p>', async () => {
    const el = await fixture('<is-true></is-true>');
    expect(el).dom.to.semantically('<is-true><p>NOPE</p></is-true>');
  });

  it('true values will have a light-dom of <p>YEAH</p>', async () => {
    const el = await litFixture(html`<is-true .value=${1 === 1}></set-game>`);
    expect(el.result).to.be.true;
    expect(el).dom.to.semantically('<is-true><p>YEAH</p></is-true>');
  });
});
```

For some real tests look at our [Set-Game Example Test Files](https://github.com/open-wc/example-vanilla-set-game/tree/master/test).
