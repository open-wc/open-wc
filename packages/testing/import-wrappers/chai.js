/**
 * In the browser, importing chai/chai.js will register to the window. In webpack it will
 * be parsed as a commonjs module, so it won't be on the window. In this file we conditionally
 * export from the window, or a webpack specific module import.
 */

/* eslint-disable global-require, import/no-mutable-exports */
import 'chai/chai.js';

// @ts-ignore
export default window.chai ||
  (() => {
    if (typeof require === 'function') {
      return require('chai/chai.js');
    }

    throw new Error(
      'Error importing chai/chai.js, are you using a bundler or build tool that doesnt handle es modules?',
    );
  })();
