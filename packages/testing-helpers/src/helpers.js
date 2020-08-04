let defineCECounter = 0;

/**
 * Registers a new element with an automatically generated unique name.
 * Helps to make a test fully isolated.
 *
 * @example
 * const tag = defineCE(class extends MyMixin(HTMLElement) {
 *   // define custom element class body
 * });
 * const el = fixture(`<${tag}></${tag}>`);
 * // test el
 *
 * @template {HTMLElement} T
 * @param {import("@open-wc/dedupe-mixin").Constructor<T>} klass Class which extends HTMLElement
 * @returns {string} Tag name of the registered element
 */
export function defineCE(klass) {
  const tag = `test-${defineCECounter}`;
  customElements.define(tag, klass);
  defineCECounter += 1;
  return tag;
}

/**
 * Indicates that this is Internet Explorer.
 *
 * @returns {boolean}
 */
export function isIE() {
  return !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
}

/**
 * Resolves after provided amount of miliseconds.
 *
 * @example
 * await aTimeout(100);
 *
 * @param {number} ms Miliseconds.
 * @returns {Promise<void>} Promise to await until time is up
 */
export function aTimeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * Resolves after requestAnimationFrame.
 *
 * @example
 * await nextFrame();
 *
 * @returns {Promise<void>} Promise that resolved after requestAnimationFrame
 */
export function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

/**
 * Blurs the provided element and await time before and after it on IE.
 *
 * @example
 * const el = await fixture('<input type="text" autofocus />');
 * await triggerBlurFor(el);
 * // el is no longer focused
 *
 * @param {HTMLElement} element Element/Node to blur
 * @returns {Promise<void>} Promise to await until blur is done (for IE)
 */
export async function triggerBlurFor(element) {
  if (isIE()) {
    await nextFrame();
    await nextFrame();
  }
  element.blur();
  if (isIE()) {
    element.blur();
    await nextFrame();
    await nextFrame();
  }
}

/**
 * Focuses the provided element and await time before and after it on IE.
 *
 * Background info:
 * Adding an event and immediately trigger it fails in IE.
 * Also before checking the effects of a trigger IE needs some time.
 *
 * @example
 * const el = await fixture('<input type="text" />');
 * await triggerFocusFor(el);
 * // el is now focused
 *
 * @param {HTMLElement} element Element/Node to focus
 * @returns {Promise<void>} Promise to await until focus is done (for IE)
 */
export async function triggerFocusFor(element) {
  if (isIE()) {
    await nextFrame();
    await nextFrame();
  }
  element.focus();
  if (isIE()) {
    element.focus();
    await nextFrame();
    await nextFrame();
  }
}

/**
 * Listens for one event and resolves with this event object after it was fired.
 *
 * @example
 * setTimeout(() => el.fireDone());
 * await oneEvent(el, 'done');
 * expect(el.done).to.be.true;
 *
 * @param {EventTarget} eventTarget Target of the event, usually an Element
 * @param {string} eventName Name of the event
 * @returns {Promise<CustomEvent>} Promise to await until the event has been fired
 */
export function oneEvent(eventTarget, eventName) {
  return new Promise(resolve => {
    function listener(ev) {
      resolve(ev);
      eventTarget.removeEventListener(eventName, listener);
    }
    eventTarget.addEventListener(eventName, listener);
  });
}

/**
 * Waits until the given predicate returns a truthy value. Calls and awaits the predicate
 * function at the given interval time. Can be used to poll until a certain condition is true.
 *
 * @example
 * ```js
 * import { fixture, waitUntil } from '@open-wc/testing-helpers';
 *
 * const element = await fixture(html`<my-element></my-element>`);
 *
 * await waitUntil(() => element.someAsyncProperty, 'element should become ready');
 * ```
 *
 * @param {() => boolean | Promise<boolean>} predicate - predicate function which is called each poll interval.
 *   The predicate is awaited, so it can return a promise.
 * @param {string} [message] an optional message to display when the condition timed out
 * @param {{ interval?: number, timeout?: number }} [options] timeout and polling interval
 */
export function waitUntil(predicate, message, options = {}) {
  const { interval = 50, timeout = 1000 } = options;

  return new Promise((resolve, reject) => {
    let timeoutId;

    setTimeout(() => {
      clearTimeout(timeoutId);
      reject(new Error(message ? `Timeout: ${message}` : `waitUntil timed out after ${timeout}ms`));
    }, timeout);

    async function nextInterval() {
      try {
        if (await predicate()) {
          resolve();
        } else {
          timeoutId = setTimeout(() => {
            nextInterval();
          }, interval);
        }
      } catch (error) {
        reject(error);
      }
    }
    nextInterval();
  });
}
