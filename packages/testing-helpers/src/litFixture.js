import { TemplateResult } from 'lit-html';
import { fixtureWrapper } from './fixtureWrapper.js';
import { render } from './lit-html.js';
import { elementUpdated } from './elementUpdated.js';
import { NODE_TYPES } from './lib.js';
import { getScopedElementsTemplate } from './scopedElementsWrapper.js';

/**
 * @typedef {
     import('lit-html').TemplateResult
   | import('lit-html').TemplateResult[]
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
 * @returns {T}
 */
export function litFixtureSync(template, options = {}) {
  const wrapper = fixtureWrapper(options.parentNode);

  render(
    options.scopedElements ? getScopedElementsTemplate(template, options.scopedElements) : template,
    wrapper,
  );

  if (template instanceof TemplateResult) {
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
  /** @type {T} */
  // NB: in the case of scopedElements, this is ScopedElementsTestWrapper, not T,
  // but that's only a small lie
  const el = litFixtureSync(template, options);
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
