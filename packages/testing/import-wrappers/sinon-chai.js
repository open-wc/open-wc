/* eslint-disable global-require, import/no-mutable-exports */
import chai from './chai.js';
import 'sinon-chai';

/**
 * In the browser sinon-chai registers itself to chai, while when parsed as a
 * commonjs module in webpack it doesn't self register. We need to register
 * it in that case.
 */
if (typeof require === 'function') {
  const sinonChai = require('sinon-chai');
  chai.use(sinonChai);
}
