# Testing

Having tests should be the fundament of every production ready product.

## Bare Testing Setup
We recommend using [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development)(Behavior Driven Development) as it seem to be easier when talking to non tech collegues. However note that this can still be a personal preference - we give this recommodation to promote unity within everyone using this recommodation.

Using:
- System via [mocha](https://mochajs.org/)
- Assertions via [chai](https://www.chaijs.com/)
- Mocks via [sinon](https://sinonjs.org/)

Setup
```sh
npx -p yo -p generator-open-wc -c 'yo open-wc:testing-bare'
```

::: tip Info
This is part of the default recommodations
:::

### Usage
For now we still recommend using `polymer serve` in order to get bare module support.
- run `polymer serve`
- open browser at `http://127.0.0.1:8081/components/<component-name>/testing/`



## Test Helpers
In order to efficient test webcomponent you will need some helpers to register and instanciate them.

### Test a custom element
```js
import { htmlFixture } from '@open-wc/testing/bdd.js';

it('can instanciate an element', async () => {
  const el = await htmlFixture('<my-el foo="bar"></my-el>');
  expect(el.getAttribute('foo')).to.equal('bar');
}
```

### Test a custom element with properties
```js
import { html, litHtmlFixture } from '@open-wc/testing/bdd.js';

it('can instanciate an element with properties', async () => {
  const el = await litHtmlFixture(html`<my-el .foo=${'bar'}></my-el>`);
  expect(el.foo).to.equal('bar');
}
```

### Test a custom class
If you test a mixin or you have multiple base classes that offer a various set of options you will find yourself in the situation of needing multiple custom element names in your tests.
This is rather dangerous as custom elements are global so you do not want to have overlapping names in your tests.
Therefore we recommend using a special function for it.
```js
import { htmlFixture, registerUniqueElement } from '@open-wc/testing/bdd.js';

const tag = registerUniqueElement(class extends MyMixin(HTMLElement) {
  constructor() {
    super();
    this.foo = true;
  }
});
const el = htmlFixture(`<${tag}></${tag}>`);
expect(el.foo).to.be.true;
```

### Test a custom class with properties
For lit-html it's a little tougher as it does not support dynamic tag names by default.  
This is using a "workaround" which is not performant for rerenders.
As this is usually not a problem for tests it's ok here but do NOT use it in production code.

```js
import { html, lithtmlFixture, registerUniqueElement, unsafeStatic } from '@open-wc/testing/bdd.js';

const tagName = registerUniqueElement(class extends MyMixin(HTMLElement) {
  constructor() {
    super();
    this.foo = true;
  }
});
const tag = unsafeStatic(tagName);
const el = litHtmlFixture(html`<${tag} .bar=${'baz'}></${tag}>`);
expect(el.bar).to.equal('baz');
```

### Timings
If you need to wait for multiple elements to update you can use flush.  
By default it will be a timeout of 2ms but it will use a `window.flush` method if set.

```js
import { flush, timeoutAsync, html, litHtmlFixture } from '@open-wc/testing/bdd.js';

const el = await litHtmlFixture(html`<my-el .foo=${'bar'}></my-el>`);
expect(el.foo).to.equal('bar');
el.foo = 'baz';
await flush();
// or as an alternative us timeout
// await timeoutAsync(10); // would wait 10ms
expect(el.shadowRoot.querySelector('#foo').innerText).to.equal('baz');
```

### Check for events 
tbd





## Run tests in local browsers via karma
Using:
- Runner via [karma](https://karma-runner.github.io/)
- Building via [webpack](https://webpack.js.org/) via [karma-webpack](https://github.com/webpack-contrib/karma-webpack)
- Test Coverage via [istanbul](https://istanbul.js.org/) via [istanbul-instrumenter-loader](https://github.com/webpack-contrib/istanbul-instrumenter-loader)

Setup
```sh
npx -p yo -p generator-open-wc -c 'yo open-wc:testing-karma'
```

::: tip Info
This is part of the default recommodations
:::

### Usage
```sh
npm run test
```



## Run tests in browserstack browsers/devices
You will need to have a browserstack automate account.

Using:
- Setup from above for karma
- Testing via [Browserstack](https://www.browserstack.com/) via [karma-browserstack-launcher](https://github.com/karma-runner/karma-browserstack-launcher)

Setup
```sh
npx -p yo -p generator-open-wc -c 'yo open-wc:testing-karma-bs'

# one time setup of the browserstack api key
# tbd
```

::: tip Info
This is part of the default recommodations
:::

### Usage
```sh
npm run test:bs
```
