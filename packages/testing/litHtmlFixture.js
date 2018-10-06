import { FixtureWrapper } from './htmlFixture.js';
import { render } from './lit-html.js';
import { flush } from './helpers.js';

/**
 * Setups an element synchronously from the provided lit-html template and puts it in the DOM.
 *
 * @param {TemplateResult} template
 * @returns {HTMLElement}
 */
export function litHtmlFixtureSync(template) {
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
export async function litHtmlFixture(template) {
  const fixture = litHtmlFixtureSync(template);
  await flush();
  return fixture;
}
