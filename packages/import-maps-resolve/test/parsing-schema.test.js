/* eslint-disable no-restricted-syntax */
import chai from 'chai';
import { parseFromString } from '../src/parser.js';
import { expectBad, expectSpecifierMap } from './helpers/parsing.js';

const { expect } = chai;

const nonObjectStrings = ['null', 'true', '1', '"foo"', '[]'];

// test('Invalid JSON', () => {
//   expect(() => parseFromString('{ imports: {} }', 'https://base.example/')).toThrow(SyntaxError);
// });

describe('Mismatching the top-level schema', () => {
  it('should throw for top-level non-objects', () => {
    for (const nonObject of nonObjectStrings) {
      expectBad(nonObject, 'https://base.example/');
    }
  });

  it('should throw if imports is a non-object', () => {
    for (const nonObject of nonObjectStrings) {
      expectBad(`{ "imports": ${nonObject} }`, 'https://base.example/');
    }
  });

  it('should throw if scopes is a non-object', () => {
    for (const nonObject of nonObjectStrings) {
      expectBad(`{ "scopes": ${nonObject} }`, 'https://base.example/');
    }
  });

  it('should ignore unspecified top-level entries', () => {
    expect(
      parseFromString(
        `{
      "imports": {},
      "new-feature": {}
    }`,
        'https://base.example/',
      ),
    ).to.deep.equal({ imports: {}, scopes: {} });
  });
});

describe('Mismatching the specifier map schema', () => {
  const invalidAddressStrings = ['true', '1', '{}'];
  const invalidInsideArrayStrings = ['null', 'true', '1', '{}', '[]'];

  it('should ignore entries where the address is not a string, array, or null', () => {
    for (const invalid of invalidAddressStrings) {
      expectSpecifierMap(
        `{
          "foo": ${invalid},
          "bar": ["https://example.com/"]
        }`,
        'https://base.example/',
        {
          bar: ['https://example.com/'],
        },
      );
    }
  });

  it('should ignore entries where the specifier key is an empty string', () => {
    expectSpecifierMap(
      `{
        "": ["https://example.com/"]
      }`,
      'https://base.example/',
      {},
    );
  });

  it('should ignore members of an address array that are not strings', () => {
    for (const invalid of invalidInsideArrayStrings) {
      expectSpecifierMap(
        `{
          "foo": ["https://example.com/", ${invalid}],
          "bar": ["https://example.com/"]
        }`,
        'https://base.example/',
        {
          foo: ['https://example.com/'],
          bar: ['https://example.com/'],
        },
      );
    }
  });

  it("should throw if a scope's value is not an object", () => {
    for (const invalid of nonObjectStrings) {
      expectBad(`{ "scopes": { "https://scope.example/": ${invalid} } }`, 'https://base.example/');
    }
  });
});

describe('Normalization', () => {
  it('should normalize empty import maps to have imports and scopes keys', () => {
    expect(parseFromString(`{}`, 'https://base.example/')).to.deep.equal({
      imports: {},
      scopes: {},
    });
  });

  it('should normalize an import map without imports to have imports', () => {
    expect(parseFromString(`{ "scopes": {} }`, 'https://base.example/')).to.deep.equal({
      imports: {},
      scopes: {},
    });
  });

  it('should normalize an import map without scopes to have scopes', () => {
    expect(parseFromString(`{ "imports": {} }`, 'https://base.example/')).to.deep.equal({
      imports: {},
      scopes: {},
    });
  });

  it('should normalize addresses to arrays', () => {
    expectSpecifierMap(
      `{
        "foo": "https://example.com/1",
        "bar": ["https://example.com/2"],
        "baz": null
      }`,
      'https://base.example/',
      {
        foo: ['https://example.com/1'],
        bar: ['https://example.com/2'],
        baz: [],
      },
    );
  });
});
