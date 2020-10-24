const { expect } = require('chai');
const { createOrderedExports } = require('../../../src/shared/createOrderedExports');

describe('createOrderedExports', () => {
  it('creates an ordered export', async () => {
    const source = `export const foo = 'bar';

export function fooBar () {

}

class FooBar {

}

const loremIpsum = () => 'Lorem Ipsum';

export default {
  foo: 'bar',
  bar: 'foo',
  lorem: 'ipsum'
}

export { FooBar as RenamedFooBar, loremIpsum };`;
    const result = await createOrderedExports(source);

    expect(result).to.equal(
      "export const __namedExportsOrder = ['foo', 'fooBar', 'RenamedFooBar', 'loremIpsum'];",
    );
  });
});
