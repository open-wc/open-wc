/* eslint-disable global-require, import/no-mutable-exports */
import chai from './chai.js';
import 'chai-dom';

/**
 * In the browser chai-dom registers itself to chai, while when parsed as a
 * commonjs module in webpack it doesn't self register. We need to register
 * it in that case.
 */
if (typeof require === 'function') {
  const chaiDom = require('chai-dom');
  chai.use(chaiDom);
}
