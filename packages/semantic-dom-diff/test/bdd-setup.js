/* istanbul ignore next */
// do manual setup and not use testing to not have circle dependencies
import 'chai/chai.js';
import { cachedWrappers } from '@open-wc/testing-helpers/index-no-side-effects.js';
import { chaiDomDiff } from '../chai-dom-diff.js';
// eslint-disable-next-line
/// <reference path="../chai-dom-diff-plugin.d.ts" />

// register-cleanup
if (afterEach) {
  afterEach(() => {
    if (cachedWrappers) {
      cachedWrappers.forEach(wrapper => {
        document.body.removeChild(wrapper);
      });
    }
    cachedWrappers.length = 0; // reset it like this as we can't reassign it
  });
}

// register-plugins
window.chai.use(chaiDomDiff);

const { expect, assert, should } = window.chai;
export { expect, assert, should };
