/* istanbul ignore next */
// do manual setup and not use testing to not have circle dependencies
import 'chai/chai.js';
// eslint does not understand export maps yet

import { cachedWrappers } from '@open-wc/testing-helpers/pure';
import { chaiDomDiff } from '../chai-dom-diff.js';

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
