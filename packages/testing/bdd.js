import { cachedWrappers } from './htmlFixture.js';

export { html, unsafeStatic } from './lit-html.js';
export {
  blurTrigger, focusTrigger, eventTrigger, isIE, registerUniqueElement, timeoutAsync,
} from './helpers.js';
export { litHtmlFixture, litHtmlFixtureSync } from './litHtmlFixture.js';
export { htmlFixture, htmlFixtureSync } from './htmlFixture.js';

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
