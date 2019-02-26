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
 * @param {function} klass
 * @returns {string}
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
 * Resolves after provided amount of time.
 *
 * @param {number} ms Miliseconds.
 * @returns {Promise<void>}
 */
export function aTimeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * Resolves after requestAnimationFrame.
 *
 * @returns {Promise<void>}
 */
export function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

/**
 * Resolves after blur.
 *
 * @param {HTMLElement} element
 * @returns {Promise<void>}
 */
export async function triggerBlurFor(element) {
  if (isIE()) {
    await nextFrame();
    await nextFrame();
  }
  element.blur();
  if (isIE()) {
    await nextFrame();
    await nextFrame();
  }
}

/**
 * Resolves after focus.
 * Adding an event and immediately trigger it in fails in IE.
 * Also before checking the effects of a trigger IE needs some time.
 *
 * @param {HTMLElement} element
 * @returns {Promise<void>}
 */
export async function triggerFocusFor(element) {
  if (isIE()) {
    await nextFrame();
    await nextFrame();
  }
  element.focus();
  if (isIE()) {
    await nextFrame();
    await nextFrame();
  }
}

/**
 * Listens for one event and resolves with this event object after it was fired.
 *
 * @param {HTMLElement} element
 * @param {string} eventName
 * @returns {Promise<Event>}
 */
export function oneEvent(element, eventName) {
  return new Promise(resolve => {
    function listener(ev) {
      resolve(ev);
      element.removeEventListener(eventName, listener);
    }
    element.addEventListener(eventName, listener);
  });
}
