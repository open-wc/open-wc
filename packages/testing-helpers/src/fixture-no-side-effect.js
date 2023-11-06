import { stringFixture, stringFixtureSync } from './stringFixture.js';
import { litFixture, litFixtureSync } from './litFixture.js';
import { isValidRenderArg } from './lib.js';

/**
 * @typedef {object} FixtureOptions
 * @property {*} [render] optional render function to use
 * @property {Element} [parentNode] optional parent node to render the fixture's template to
 * @property {import('@open-wc/scoped-elements/html-element.js').ScopedElementsMap} [scopedElements] optional scoped-elements
 * definition map
 */

/**
 * Renders a string/TemplateResult and puts it in the DOM via a fixtureWrapper.
 *
 * @example
 * const el = fixtureSync('<my-el><span></span></my-el>');
 *
 * @template {Element} T
 * @param {import('./renderable.js').LitHTMLRenderable} template Either a string or lit-html TemplateResult
 * @param {FixtureOptions} [options]
 * @returns {T} First child of the rendered DOM
 */
export function fixtureSync(template, options) {
  if (typeof template === 'string') {
    return stringFixtureSync(template, options);
  }
  if (!!options?.render || isValidRenderArg(template)) {
    return litFixtureSync(template, options);
  }
  throw new Error(
    'Invalid template provided - string, number, boolean, Node, TemplateResult, or array or iterable thereof are supported',
  );
}

/**
 * Renders a string/TemplateResult and puts it in the DOM via a fixtureWrapper.
 * By default fixture awaits the elements "update complete" Promise.
 * - for [lit-element](https://github.com/polymer/lit-element) that is `el.updateComplete`;
 * - for [stencil](https://github.com/ionic-team/stencil/) that is `el.componentOnReady()`;
 *
 * If none of those specfic Promise hooks are found, it will wait for one frame via
 * `await nextFrame()`.
 *
 * **Note**: this does not guarantee that the element is done rendering -
 * it just waits for the next JavaScript tick.
 *
 * @example
 * const el = await fixture('<my-el><span></span></my-el>');
 * expect(el.fullyRendered).to.be.true;
 *
 * @template {Element} T
 * @param {import('./renderable.js').LitHTMLRenderable} template Either a string or lit-html TemplateResult
 * @param {FixtureOptions} [options]
 * @returns {Promise<T>} A Promise that will resolve to the first child of the rendered DOM
 */
export async function fixture(template, options) {
  if (typeof template === 'string') {
    return stringFixture(template, options);
  }
  if (!!options?.render || isValidRenderArg(template)) {
    return litFixture(template, options);
  }
  throw new Error('Invalid template provided - string or lit-html TemplateResult is supported');
}
