import { nextFrame } from './helpers.js';

const isDefinedPromise = action => typeof action === 'object' && Promise.resolve(action) === action;

/**
 * Awaits for "update complete promises" of elements
 * - for [lit-element](https://github.com/polymer/lit-element) that is `el.updateComplete`;
 * - for [stencil](https://github.com/ionic-team/stencil/) that is `el.componentOnReady()`;
 *
 * If none of those specfic Promise hooks are found, it will wait for one frame via
 * `await nextFrame()`.
 *
 * Ensures that ShadyDOM finished its job if available.
 *
 * @template {Element} T
 * @param {T} el
 * @returns {Promise<T>}
 */
export async function elementUpdated(el) {
  let hasSpecificAwait = false;
  // @ts-ignore
  let update = el && el.updateComplete;
  if (isDefinedPromise(update)) {
    await update;
    hasSpecificAwait = true;
  }

  // @ts-ignore
  update = el && el.componentOnReady ? el.componentOnReady() : false;
  if (isDefinedPromise(update)) {
    await update;
    hasSpecificAwait = true;
  }

  if (!hasSpecificAwait) {
    await nextFrame();
  }

  // @ts-ignore
  if (window.ShadyDOM && typeof window.ShadyDOM.flush === 'function') {
    // @ts-ignore
    window.ShadyDOM.flush();
  }

  return el;
}
