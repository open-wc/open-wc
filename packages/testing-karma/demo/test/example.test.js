import { expect } from 'chai';
import { foo } from '../src/example';

describe('foo()', () => {
  it('returns false when given true', () => {
    expect(foo(true)).to.equal(false);
  });

  it('returns true when given false', () => {
    expect(foo(false)).to.equal(true);
  });
});
