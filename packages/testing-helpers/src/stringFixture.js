import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { fixtureWrapper } from './fixtureWrapper.js';
import { elementUpdated } from './elementUpdated.js';
import { litFixture } from './litFixture.js';

/**
 * Setups an element synchronously from the provided string template and puts it in the DOM.
 * Allows to specify properties via an object or a function taking the element as an argument.
 *
 * @template {Element} T - Is an element or a node
 * @param {string} template
 * @param {import('./fixture-no-side-effect.js').FixtureOptions} [options={}]
 * @returns {T}
 */
export function stringFixtureSync(template, options = {}) {
  const parentNode = fixtureWrapper(options.parentNode);
  parentNode.innerHTML = template;
  return /** @type {T} */ (parentNode.children[0]);
}

/**
 * Setups an element asynchronously from the provided string template and puts it in the DOM.
 * Allows to specify properties via an object or a function taking the element as an argument.
 *
 * @template {Element} T - Is an element or a node
 * @param {string} template
 * @param {import('./fixture-no-side-effect.js').FixtureOptions} [options]
 * @returns {Promise<T>}
 */
export async function stringFixture(template, options = {}) {
  if (options.scopedElements) {
    // @ts-ignore
    return litFixture(html`${unsafeHTML(template)}`, options);
  }

  const el = stringFixtureSync(template, options);
  await elementUpdated(el);
  // @ts-ignore
  return el;
}
