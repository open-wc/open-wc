# Testing

Having tests should be the fundament of every production ready product.

## Bare Testing
We recommend using [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development)(Behavior Driven Development) as it seem to be easier when talking to non tech collegues. However note that this can still be a personal preference - we give this recommendation to promote unity within everyone using this recommendation.

Using:
- System via [mocha](https://mochajs.org/)
- Assertions via [chai](https://www.chaijs.com/)
- Mocks via [sinon](https://sinonjs.org/)

::: tip Info
This is part of the default recommendations
:::

### Setup
```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:testing-bare'
```

### Manual Setup
```bash
yarn add @open-wc/testing
```

Add to your test:
```js
import { fixture, litFixture, expect } '@open-wc/testing';
```

### Usage
For now we still recommend using `polymer serve` in order to get bare module support.
- run `polymer serve`
- open browser at `http://127.0.0.1:8081/components/<component-name>/testing/`



## Run tests in local browsers via karma
Using:
- Runner via [karma](https://karma-runner.github.io/)
- Building via [webpack](https://webpack.js.org/) via [karma-webpack](https://github.com/webpack-contrib/karma-webpack)
- Test Coverage via [istanbul](https://istanbul.js.org/) via [istanbul-instrumenter-loader](https://github.com/webpack-contrib/istanbul-instrumenter-loader)

### Setup
```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:testing-karma'
```

::: tip Info
This is part of the default recommendations
:::

### Usage
```bash
npm run test
```



## Run tests in browserstack browsers/devices
You will need to have a browserstack automate account.

Using:
- Setup from above for karma
- Testing via [Browserstack](https://www.browserstack.com/) via [karma-browserstack-launcher](https://github.com/karma-runner/karma-browserstack-launcher)

### Setup
```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:testing-karma-bs'

# one time setup of the browserstack api key
# tbd
```

::: tip Info
This is part of the default recommendations
:::

### Usage
```bash
npm run test:bs
```



## Run tests in your IDE via wallaby.js
Wallaby.js is a Plugin for your IDE and runs the tests in real time while you are typing.

Using:
- In IDE Testing via [wallaby.js](https://wallabyjs.com/)

### Setup
```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:wallaby'
```

### Manual Setup
1. Copy the [config](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/testing-wallaby/templates/static/wallaby.js) and save it as `wallaby.js` into your project root
1. Install `@open-wc/testing-wallaby` via npm or yarn `yarn add @open-wc/testing-wallaby --dev`

### Usage
Open your wallaby.js supported IDE and start it with the provided config.
