/**
 * Registers a new element with an automatically generated unique name.
 * Helps to make a test fully isolated.
 *
 * @example
 * const tag = registerUniqueElement(class extends MyMixin(HTMLElement) {
 *   // define custom element class body
 * });
 * const el = htmlFixture(`<${tag}></${tag}>`);
 * // test el
 *
 * @param {function()} klass
 * @returns {string}
 */
export function registerUniqueElement(klass) {
  const uniqueNumberString = `${Date.now()}${Math.random()}`.replace('.', '');
  const name = `test-${uniqueNumberString}`;
  customElements.define(name, klass);
  return name;
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
export async function timeoutAsync(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Resolves after blur.
 *
 * @param {HTMLElement} element
 * @returns {Promise<void>}
 */
export async function blurTrigger(element) {
  element.blur();
  if (isIE()) {
    await timeoutAsync();
  }
}

/**
 * Resolves after focus.
 *
 * @param {HTMLElement} element
 * @returns {Promise<void>}
 */
export async function focusTrigger(element) {
  element.focus();
  if (isIE()) {
    await timeoutAsync();
  }
}

/**
 * Listens for one event and resolves with this event object after it was fired.
 *
 * @param {HTMLElement} element
 * @param {string} eventName
 * @returns {Promise<Event>}
 */
export async function eventTrigger(element, eventName) {
  return new Promise((resolve) => {
    function listener(event) {
      resolve(event);
      element.removeEventListener(eventName, listener);
    }
    element.addEventListener(eventName, listener);
  });
}

/**
 * Resolves after flush.
 * Useful in async tests with await keyword.
 *
 * @returns {Promise<void>}
 */
export async function flush() {
  return new Promise((resolve) => {
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
