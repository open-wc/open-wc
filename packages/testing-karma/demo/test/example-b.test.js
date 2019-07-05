import { expect } from '@bundled-es-modules/chai';
import { foo } from '../src/example.js';

describe('b', () => {
  describe('foo()', () => {
    it('returns false when given true', () => {
      expect(foo(true)).to.equal(false);
    });

    it('returns true when given false', async () => {
      expect(foo(false)).to.equal(true);
    });
  });
});
