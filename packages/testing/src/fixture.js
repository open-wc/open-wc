import {
  fixture as originalFixture,
  fixtureSync as originalFixtureSync,
  cleanupFixture,
} from '@open-wc/testing-helpers';

/**
 * @typedef {object} FixtureOptions
 * @property {boolean} autoCleanup whether the fixture should automatically
 *   register the fixture to be cleaned from the dom
 */

const defaultOptions = { autoCleanup: true };

/**
 * @param {Element} element
 * @param {FixtureOptions} options
 */
function setupCleanup(element, options) {
  if (options.autoCleanup) {
    if ('afterEach' in window && typeof window.afterEach === 'function') {
      afterEach(() => {
        cleanupFixture(element);
      });
    }
  }
}

/**
 * Renders a string/TemplateResult and puts it in the DOM via a fixtureWrapper.
 *
 * @example
 * const el = fixtureSync('<my-el><span></span></my-el>');
 *
 * @template {Element} T
 * @param {unknown} template Either a string or a valid lit-html render value.
 * @param {FixtureOptions} options
 * @returns {T} First child of the rendered DOM
 */
export function fixtureSync(template, options = defaultOptions) {
  const element = originalFixtureSync(template);
  setupCleanup(element, options);
  return /** @type {T} */ (element);
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
 * @param {string | unknown} template Either a string or a valid lit-html render value.
 * @param {FixtureOptions} options
 * @returns {Promise<T>} A Promise that will resolve to the first child of the rendered DOM
 */
export async function fixture(template, options = defaultOptions) {
  const element = await originalFixture(template);
  setupCleanup(element, options);
  return /** @type {T} */ (element);
}
