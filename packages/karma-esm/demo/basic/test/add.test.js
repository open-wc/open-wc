import { stub } from 'sinon';
import { expect } from './setup.js';
import { add } from '../src/utils.js';

describe('add()', () => {
  it('works', () => {
    expect(add(2, 3)).to.equal(5);
    const obj = {
      foo() {},
    };
    stub(obj, 'foo');
  });
});
