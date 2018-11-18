import { cachedWrappers } from '@open-wc/testing-helpers/fixture.js';

if (afterEach) {
  afterEach(() => {
    if (cachedWrappers) {
      cachedWrappers.forEach((wrapper) => {
        document.body.removeChild(wrapper);
      });
    }
    cachedWrappers.length = 0; // reset it like this as we can't reassign it
  });
}
