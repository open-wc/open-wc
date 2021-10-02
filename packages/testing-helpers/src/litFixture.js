import { render } from 'lit/html.js';
import { isTemplateResult } from 'lit/directive-helpers.js';
import { fixtureWrapper } from './fixtureWrapper.js';
import { elementUpdated } from './elementUpdated.js';
import { NODE_TYPES } from './lib.js';

/**
 * @typedef {
     import('lit').TemplateResult
   | import('lit').TemplateResult[]
   | Node | Node[]
   | string | string[]
   | number | number[]
   | boolean | boolean[]
 } LitHTMLRenderable
 */

const isUsefulNode = ({ nodeType, textContent }) => {
  switch (nodeType) {
    case NODE_TYPES.COMMENT_NODE:
      return false;
    case NODE_TYPES.TEXT_NODE:
      return textContent.trim();
    default:
      return true;
  }
};

/**
 * Setups an element synchronously from the provided lit-html template and puts it in the DOM.
 *
 * @template {Element} T - Is an element or a node
 * @param {LitHTMLRenderable} template
 * @param {import('./fixture-no-side-effect.js').FixtureOptions} [options]
 * @param {import('./scopedElementsWrapper.js').ScopedElementsTemplateGetter} [getScopedElementsTemplate]
 * @returns {T}
 */
export function litFixtureSync(template, options = {}, getScopedElementsTemplate) {
  const wrapper = /** @type {HTMLElement} */ (fixtureWrapper(options.parentNode));

  render(
    options.scopedElements ? getScopedElementsTemplate(template, options.scopedElements) : template,
    wrapper,
  );

  if (isTemplateResult(template)) {
    return /** @type {T} */ (wrapper.firstElementChild);
  }
  const [node] = Array.from(wrapper.childNodes).filter(isUsefulNode);

  return /** @type {T} */ (node);
}

/**
 * Setups an element asynchronously from the provided lit-html template and puts it in the DOM.
 *
 * @template {Element} T - Is an element or a node
 * @param {LitHTMLRenderable} template
 * @param {import('./fixture-no-side-effect.js').FixtureOptions} [options]
 * @returns {Promise<T>}
 */
export async function litFixture(template, options = {}) {
  /** @type {import('./scopedElementsWrapper.js').ScopedElementsTemplateGetter|undefined} */
  const getScopedElementsTemplate = options.scopedElements
    ? await import('./scopedElementsWrapper.js').then(
        scopedElementWrapper => scopedElementWrapper.getScopedElementsTemplate,
      )
    : undefined;
  /** @type {T} */
  // NB: in the case of scopedElements, this is ScopedElementsTestWrapper, not T,
  // but that's only a small lie
  const el = litFixtureSync(template, options, getScopedElementsTemplate);
  await elementUpdated(el);

  if (options.scopedElements) {
    const [node] =
      /** @type {T[]} */
      (Array.from(el.shadowRoot.childNodes).filter(isUsefulNode));
    await elementUpdated(node);

    return node;
  }

  return el;
}
