const PLUGIN_NAME = 'WebpackIndexHTMLPlugin';

/**
 * @template T
 * @typedef {object} DeferredPromise
 * @property {Promise<T>} promise
 * @property {(arg: T) => void} resolve
 * @property {(error: any) => void} reject
 */

/** @param {string} msg */
function createError(msg) {
  return new Error(`[${PLUGIN_NAME}]: ${msg}`);
}

/**
 * @template T
 * @returns {DeferredPromise<T>}
 */
function createDeferredPromise() {
  /** @type {Partial<DeferredPromise<T>>} */
  const deferredPromise = {};
  deferredPromise.promise = new Promise((resolve, reject) => {
    deferredPromise.resolve = resolve;
    deferredPromise.reject = reject;
  });

  // @ts-ignore
  return deferredPromise;
}

/**
 * @template T
 * @param {Promise<T>} promise
 * @param {number} timeout
 * @param {string} msg
 * @returns {Promise<T>}
 */
function waitOrTimeout(promise, timeout, msg) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(msg));
    }, timeout);

    promise.then(result => {
      resolve(result);
      clearTimeout(timeoutId);
    });
  });
}

module.exports = {
  PLUGIN_NAME,
  createError,
  createDeferredPromise,
  waitOrTimeout,
};
