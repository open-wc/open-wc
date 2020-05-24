// @ts-nocheck
/**
 * In the browser, importing axe-core/axe.min.js will register to the window. In webpack it will
 * be parsed as a commonjs module, so it won't be on the window. In this file we conditionally
 * export from the window, or a webpack specific module import.
 */

/* eslint-disable global-require, import/no-mutable-exports */
export let axe;

export async function loadAxe() {
  if (window.axe) {
    // axe was already imported before
    axe = window.axe;
    return;
  }

  if (typeof require === 'function') {
    // we are in a webpack environment
    axe = require('axe-core/axe.min.js');
    return;
  }

  // regular behavior, load axe as an es module and let it
  // register to the window
  await import('axe-core/axe.min.js');
  if (!window.axe) {
    throw new Error(
      'Error importing axe-core/axe.min.js, are you using a bundler or build tool that doesnt handle es modules?',
    );
  }
  axe = window.axe;
}
