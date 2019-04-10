/* istanbul ignore next */
// do manual setup and not use testing to not have circle dependencies
import { chai } from '@bundled-es-modules/chai';
import { cachedWrappers } from '@open-wc/testing-helpers/index-no-side-effects.js';
import { chaiDomDiff } from '../chai-dom-diff.js';

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
chai.use(chaiDomDiff);
