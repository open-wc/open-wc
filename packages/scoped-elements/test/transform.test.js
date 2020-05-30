import { expect } from '@open-wc/testing';
import { transform } from '../src/transform.js';

const tags = {
  'mandalore-planet': class extends HTMLElement {},
};

describe('html', () => {
  [
    {
      input: ['<mandalore-planet>', '</mandalore-planet>'],
      output: ['<mandalore-planet-\\d{1,5}>', '</mandalore-planet-\\d{1,5}>'],
    },
    {
      input: ['<mandalore-planet class="sample">', '</mandalore-planet>'],
      output: ['<mandalore-planet-\\d{1,5} class="sample">', '</mandalore-planet-\\d{1,5}>'],
    },
    {
      input: ['<mandalore-planet\tclass="sample">', '</mandalore-planet>'],
      output: ['<mandalore-planet-\\d{1,5}\tclass="sample">', '</mandalore-planet-\\d{1,5}>'],
    },
    {
      input: ['<mandalore-planet\rclass="sample">', '</mandalore-planet>'],
      output: ['<mandalore-planet-\\d{1,5}\rclass="sample">', '</mandalore-planet-\\d{1,5}>'],
    },
    {
      input: ['<mandalore-planet class="sample"></mandalore-planet>'],
      output: ['<mandalore-planet-\\d{1,5} class="sample"></mandalore-planet-\\d{1,5}>'],
    },
    {
      input: ['<mandalore-planet class="sample" data-test="<my-component>"></mandalore-planet>'],
      output: [
        '<mandalore-planet-\\d{1,5} class="sample" data-test="<my-component>"></mandalore-planet-\\d{1,5}>',
      ],
    },
    {
      input: ['<mandalore-planet class="sample" data-test=\'<my-component>\'></mandalore-planet>'],
      output: [
        '<mandalore-planet-\\d{1,5} class="sample" data-test=\'<my-component>\'></mandalore-planet-\\d{1,5}>',
      ],
    },
  ].forEach(({ input, output }, index) => {
    it(`should transform strings tags into the actual registered tags - ${index}`, () => {
      // @ts-ignore
      transform(input, tags).forEach((value, i) => {
        expect(value).to.match(new RegExp(output[i]));
      });
    });
  });
});
