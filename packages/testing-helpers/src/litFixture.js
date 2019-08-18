import { createFixtureWrapper } from './fixture-manager.js';
import { render } from './lit-html.js';
import { elementUpdated } from './elementUpdated.js';

/**
 * Setups an element synchronously from the provided lit-html template and puts it in the DOM.
 *
 * @template {Element} T - Is an element or a node
 * @param {unknown} template
 * @returns {T}
 */
export function litFixtureSync(template) {
  const wrapper = createFixtureWrapper();
  render(template, wrapper);
  return /** @type {T} */ (wrapper.children[0]);
}

/**
 * Setups an element asynchronously from the provided lit-html template and puts it in the DOM.
 *
 * @template {Element} T - Is an element or a node
 * @param {unknown} template
 * @returns {Promise<T>}
 */
export async function litFixture(template) {
  const el = litFixtureSync(template);
  await elementUpdated(el);
  // @ts-ignore
  return el;
}
