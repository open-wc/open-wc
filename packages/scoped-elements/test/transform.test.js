import { expect } from '@open-wc/testing';
import { transform } from '../src/transform.js';

const tags = {
  'mandalore-planet': class extends HTMLElement {},
};

describe('html', () => {
  [
    {
      input: ['<mandalore-planet>', '</mandalore-planet>'],
      output: ['<mandalore-planet-se>', '</mandalore-planet-se>'],
    },
    {
      input: ['<mandalore-planet class="sample">', '</mandalore-planet>'],
      output: ['<mandalore-planet-se class="sample">', '</mandalore-planet-se>'],
    },
    {
      input: ['<mandalore-planet\tclass="sample">', '</mandalore-planet>'],
      output: ['<mandalore-planet-se\tclass="sample">', '</mandalore-planet-se>'],
    },
    {
      input: ['<mandalore-planet\rclass="sample">', '</mandalore-planet>'],
      output: ['<mandalore-planet-se\rclass="sample">', '</mandalore-planet-se>'],
    },
    {
      input: ['<mandalore-planet class="sample"></mandalore-planet>'],
      output: ['<mandalore-planet-se class="sample"></mandalore-planet-se>'],
    },
  ].forEach(({ input, output }, index) => {
    it(`should transform strings tags into the actual registered tags - ${index}`, () => {
      expect(transform(input, tags)).to.be.deep.equal(output);
    });
  });
});
