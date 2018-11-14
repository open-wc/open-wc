import { FixtureWrapper } from './fixture.js';
import { render } from './lit-html.js';
import { nextFrame } from './helpers.js';

/**
 * Setups an element synchronously from the provided lit-html template and puts it in the DOM.
 *
 * @param {TemplateResult} template
 * @returns {HTMLElement}
 */
export function litFixtureSync(template) {
  const wrapper = new FixtureWrapper();
  render(template, wrapper);
  return wrapper.children[0];
}

/**
 * Setups an element asynchronously from the provided lit-html template and puts it in the DOM.
 *
 * @param {TemplateResult} template
 * @returns {Promise<HTMLElement>}
 */
export async function litFixture(template) {
  const fixture = litFixtureSync(template);
  await nextFrame();
  return fixture;
}
