import { fixtureWrapper } from './fixtureWrapper.js';
import { render } from './lit-html.js';
import { nextFrame } from './helpers.js';

/**
 * Setups an element synchronously from the provided lit-html template and puts it in the DOM.
 *
 * @param {import('lit-html').TemplateResult} template
 * @returns {Element}
 */
export function litFixtureSync(template) {
  const wrapper = fixtureWrapper();
  render(template, wrapper);
  return wrapper.children[0];
}

/**
 * Setups an element asynchronously from the provided lit-html template and puts it in the DOM.
 *
 * @param {import('lit-html').TemplateResult} template
 * @returns {Promise<Element>}
 */
export async function litFixture(template) {
  const fixture = litFixtureSync(template);
  await nextFrame();
  return fixture;
}
