// do manual setup and not use testing to not have circle dependencies
import { cachedWrappers } from '../fixture.js';

// register-cleanup
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
