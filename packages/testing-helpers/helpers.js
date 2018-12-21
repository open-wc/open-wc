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
 * @param {function()} klass
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
 * Resolves after blur.
 *
 * @param {HTMLElement} element
 * @returns {Promise<void>}
 */
export async function triggerBlurFor(element) {
  element.blur();
  if (isIE()) {
    await aTimeout();
  }
}

/**
 * Resolves after focus.
 *
 * @param {HTMLElement} element
 * @returns {Promise<void>}
 */
export async function triggerFocusFor(element) {
  element.focus();
  if (isIE()) {
    await aTimeout();
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

export function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

/**
 * DEPRECATED:
 * Only useful with WCT pls use nextFrame as an alternative.
 * If used not within WCT it will fallback to a timout of 2ms.
 *
 * @returns {Promise<void>}
 */
export async function flush() {
  return new Promise(resolve => {
    if (window.flush) {
      window.flush(() => {
        resolve();
      });
    } else {
      setTimeout(() => {
        resolve();
      }, 2);
    }
  });
}
