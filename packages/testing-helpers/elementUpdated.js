import { nextFrame } from './helpers.js';

const isDefinedPromise = action => typeof action === 'object' && Promise.resolve(action) === action;

/**
 * Awaits for "update complete promises" of elements
 * - updateComplete [lit-element]
 * - componentOnReady() [stencil]
 *
 * If none of these is available we await the next frame.
 *
 * Ensures that ShadyDOM finished its job if available.
 *
 * @param {HTMLElement} el
 * @returns {Promise<Element>}
 */
export async function elementUpdated(el) {
  let hasSpecificAwait = false;
  let update = el && el.updateComplete;
  if (isDefinedPromise(update)) {
    await update;
    hasSpecificAwait = true;
  }

  update = el && el.componentOnReady ? el.componentOnReady() : false;
  if (isDefinedPromise(update)) {
    await update;
    hasSpecificAwait = true;
  }

  if (!hasSpecificAwait) {
    await nextFrame();
  }

  if (window.ShadyDOM && typeof window.ShadyDOM.flush === 'function') {
    window.ShadyDOM.flush();
  }

  return el;
}
