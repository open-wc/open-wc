import { expect } from '@bundled-es-modules/chai';
import { stub } from 'sinon';
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
