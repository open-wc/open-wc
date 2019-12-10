import { expect } from '@open-wc/testing';
import { getTags, registerElements } from '../src/scoped-elements.js';

describe('scoped-elements', () => {

  describe('getTags', () => {
    it('should auto define non registered elements', () => {
      class Tatooine extends HTMLElement {}
      class Coruscant extends HTMLElement {}

      const [tatooine, coruscant] = getTags([Tatooine, Coruscant]);

      expect(tatooine).to.be.equal('c-tatooine');
      expect(coruscant).to.be.equal('c-coruscant');
    });

    it('should reuse a previously registered element', () => {
      class Hoth extends HTMLElement {}

      const [hoth1] = getTags([Hoth]);
      const [hoth2] = getTags([Hoth]);

      expect(hoth1).to.be.equal(hoth2);
      expect(hoth1).to.be.equal('c-hoth');
    })
  });

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
        'naboo-planet': 'c-naboo',
        'alderaan-planet': 'c-alderaan',
        'bespin-planet': 'c-bespin',
      });
    });
  });

});
