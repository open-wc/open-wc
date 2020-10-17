import { expect, fixture } from '@open-wc/testing';
import { registerElement, defineScopedElement } from '../src/registerElement.js';

class Naboo extends HTMLElement {}

describe('registerElement', () => {
  it('should return the scoped tag name', () => {
    const nabooTag = registerElement('naboo-planet', Naboo);

    expect(nabooTag).to.match(new RegExp(`naboo-planet-\\d{1,5}`));
  });

  it('should throw an error with lazy components and no tags cache', () => {
    expect(() => registerElement('naboo-planet', undefined)).to.throw();
  });
});

describe('defineScopedElement', () => {
  it('should allow the use of lazy elements', async () => {
    const tagsCache = new Map();
    const tag = registerElement('naboo-planet', undefined, tagsCache);
    const el = await fixture(`<${tag}></${tag}>`);

    expect(el).to.not.be.an.instanceOf(Naboo);
    defineScopedElement('naboo-planet', Naboo, tagsCache);

    expect(el).to.be.an.instanceOf(Naboo);
  });
});
