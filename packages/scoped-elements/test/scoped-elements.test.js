import { expect } from '@open-wc/testing';
import { registerElements } from '../src/scoped-elements.js';

describe('scoped-elements', () => {
  describe('registerElements', () => {
    it('should return an object with the mapped registered element tags', () => {
      class Naboo extends HTMLElement {}
      class Alderaan extends HTMLElement {}
      class Bespin extends HTMLElement {}

      const result = registerElements({
        'naboo-planet': Naboo,
        'alderaan-planet': Alderaan,
        'bespin-planet': Bespin,
      });

      expect(result).to.deep.equal({
        'naboo-planet': `naboo-planet`,
        'alderaan-planet': `alderaan-planet`,
        'bespin-planet': `bespin-planet`,
      });
    });
  });
});
