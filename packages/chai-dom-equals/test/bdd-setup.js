// do manual setup and not use testing to not have circle dependencies
import { chai } from '@bundled-es-modules/chai';
import { cachedWrappers } from '@open-wc/testing-helpers/fixtureWrapper.js';
import { chaiDomEquals } from '../chai-dom-equals.js';

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
chai.use(chaiDomEquals);
