import { expect } from '@open-wc/testing';
import { registerElement } from '../src/registerElement.js';

describe('registerElements', () => {
  it('should return an object with the mapped registered element tags', () => {
    class Naboo extends HTMLElement {}
    class Alderaan extends HTMLElement {}
    class Bespin extends HTMLElement {}

    const nabooTag = registerElement('naboo-planet', Naboo);
    const alderaanTag = registerElement('alderaan-planet', Alderaan);
    const bespinTag = registerElement('bespin-planet', Bespin);

    expect(nabooTag).to.match(new RegExp(`naboo-planet-\\d{1,5}`));
    expect(alderaanTag).to.match(new RegExp(`alderaan-planet-\\d{1,5}`));
    expect(bespinTag).to.match(new RegExp(`bespin-planet-\\d{1,5}`));
  });
});
