import { expect } from '@open-wc/testing';
import { registerElement } from '../src/scoped-elements.js';
import { SUFFIX } from '../src/tag.js';

describe('scoped-elements', () => {
  describe('registerElements', () => {
    it('should return an object with the mapped registered element tags', () => {
      class Naboo extends HTMLElement {}
      class Alderaan extends HTMLElement {}
      class Bespin extends HTMLElement {}

      const nabooTag = registerElement('naboo-planet', Naboo);
      const alderaanTag = registerElement('alderaan-planet', Alderaan);
      const bespinTag = registerElement('bespin-planet', Bespin);

      expect(nabooTag).to.equal(`naboo-planet-${SUFFIX}`);
      expect(alderaanTag).to.equal(`alderaan-planet-${SUFFIX}`);
      expect(bespinTag).to.equal(`bespin-planet-${SUFFIX}`);
    });
  });
});
