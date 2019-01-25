import { nextFrame } from './helpers.js';
import { fixtureWrapper } from './fixtureWrapper.js';

/**
 * Setups an element synchronously from the provided string template and puts it in the DOM.
 * Allows to specify properties via an object or a function taking the element as an argument.
 *
 * @param {string} template
 * @returns {Element}
 */
export function stringFixtureSync(template) {
  const wrapper = fixtureWrapper();
  wrapper.innerHTML = template;
  return wrapper.children[0];
}

/**
 * Setups an element asynchronously from the provided string template and puts it in the DOM.
 * Allows to specify properties via an object or a function taking the element as an argument.
 *
 * @param {string} template
 * @returns {Promise<Element>}
 */
export async function stringFixture(template) {
  const el = stringFixtureSync(template);
  const update = el.updateComplete;
  if (typeof update === 'object' && Promise.resolve(update) === update) {
    await update;
  } else {
    await nextFrame();
  }
  return el;
}
