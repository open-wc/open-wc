import { expect } from '@open-wc/testing';
import { transform } from '../src/transform.js';

describe('html', () => {
  [
    {
      input: ['<naboo-planet>', '</naboo-planet>'],
      tags: { 'naboo-planet': 'c-naboo' },
      output: ['<c-naboo>', '</c-naboo>'],
    },
    {
      input: ['<naboo-planet class="sample">', '</naboo-planet>'],
      tags: { 'naboo-planet': 'c-naboo' },
      output: ['<c-naboo class="sample">', '</c-naboo>'],
    },
    {
      input: ['<naboo-planet\tclass="sample">', '</naboo-planet>'],
      tags: { 'naboo-planet': 'c-naboo' },
      output: ['<c-naboo\tclass="sample">', '</c-naboo>'],
    },
    {
      input: ['<naboo-planet\rclass="sample">', '</naboo-planet>'],
      tags: { 'naboo-planet': 'c-naboo' },
      output: ['<c-naboo\rclass="sample">', '</c-naboo>'],
    },
    {
      input: ['<naboo-planet class="sample"></naboo-planet>'],
      tags: { 'naboo-planet': 'c-naboo' },
      output: ['<c-naboo class="sample"></c-naboo>'],
    },
    {
      input: ['<naboo-planet class="sample">', '</naboo-planet><bespin-planet>', '</bespin-planet>'],
      tags: {
        'naboo-planet': 'c-naboo',
        'bespin-planet': 'c-bespin',
      },
      output: ['<c-naboo class="sample">', '</c-naboo><c-bespin>', '</c-bespin>'],
    },
  ].forEach(({ input, tags, output }, index) => {
    it(`should transform strings tags into the actual registered tags - ${index}`, () => {
      expect(transform(input, tags)).to.be.deep.equal(output);
    });
  })
});
