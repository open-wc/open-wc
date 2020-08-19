/* eslint-disable */
// @ts-nocheck
const assert = require('assert');
const fs = require('fs');
const chai = require('chai');
const { pathToFileURL } = require('url');
const { parseFromString } = require('../index');
const { resolve } = require('../src/resolver.js');

const { expect } = chai;

function assertNoExtraProperties(object, expectedProperties, description) {
  for (const actualProperty in object) {
    assert(
      expectedProperties.indexOf(actualProperty) !== -1,
      description + ': unexpected property ' + actualProperty,
    );
  }
}

function assertOwnProperty(j, name) {
  assert(name in j);
}

// Parsed import maps in the reference implementation uses `URL`s instead of
// strings as the values of specifier maps, while
// expected import maps (taken from JSONs) uses strings.
// This function converts `m` (expected import maps or its part)
// into URL-based, for comparison.
function normalizeImportMap(m) {
  if (typeof m === 'string') {
    return new URL(m);
  }

  if (!m || typeof m !== 'object') {
    return m;
  }

  const result = {};
  for (const key in m) {
    result[key] = normalizeImportMap(m[key]);
  }
  return result;
}

function runTests(j) {
  const { tests } = j;
  delete j.tests;

  if ('importMap' in j) {
    assertOwnProperty(j, 'importMap');
    assertOwnProperty(j, 'importMapBaseURL');
    try {
      j.parsedImportMap = parseFromString(JSON.stringify(j.importMap), new URL(j.importMapBaseURL));
    } catch (e) {
      j.parsedImportMap = e;
    }
    delete j.importMap;
    delete j.importMapBaseURL;
  }

  assertNoExtraProperties(
    j,
    [
      'expectedResults',
      'expectedParsedImportMap',
      'baseURL',
      'name',
      'parsedImportMap',
      'importMap',
      'importMapBaseURL',
      'link',
      'details',
    ],
    j.name,
  );

  if (tests) {
    // Nested node.
    for (const testName in tests) {
      let fullTestName = testName;
      if (j.name) {
        fullTestName = j.name + ': ' + testName;
      }
      tests[testName].name = fullTestName;
      const k = Object.assign(Object.assign({}, j), tests[testName]);
      runTests(k);
    }
  } else {
    // Leaf node.
    for (const key of ['parsedImportMap', 'name']) {
      assertOwnProperty(j, key, j.name);
    }
    assert(
      'expectedResults' in j || 'expectedParsedImportMap' in j,
      'expectedResults or expectedParsedImportMap should exist',
    );

    // Resolution tests.
    if ('expectedResults' in j) {
      it(`test case ${j.name}`, () => {
        assertOwnProperty(j, 'baseURL');

        expect(j.parsedImportMap).not.be.an.instanceOf(Error);

        for (const specifier in j.expectedResults) {
          const expected = j.expectedResults[specifier];
          if (!expected) {
            let result = null;
            try {
              result = resolve(specifier, j.parsedImportMap, new URL(j.baseURL)).resolvedImport;
            } catch {}
            expect(result).equal(expected);
          } else {
            // Should be resolved to `expected`.
            expect(
              resolve(specifier, j.parsedImportMap, new URL(j.baseURL)).resolvedImport.href,
            ).equal(expected);
          }
        }
      });
    }

    // Parsing tests.
    if ('expectedParsedImportMap' in j) {
      it(`test case ${j.name}`, () => {
        if (!j.expectedParsedImportMap) {
          expect(j.parsedImportMap).to.be.an.instanceOf(TypeError);
        } else {
          expect(j.parsedImportMap).to.eql(normalizeImportMap(j.expectedParsedImportMap));
        }
      });
    }
  }
}

describe('import-maps-resolve', () => {
  const testFiles = [
    'data-base-url',
    'empty-import-map',
    'overlapping-entries',
    'packages-via-trailing-slashes',
    'parsing-addresses-absolute',
    'parsing-addresses-invalid',
    'parsing-addresses',
    'parsing-invalid-json',
    'parsing-schema-normalization',
    'parsing-schema-scope',
    'parsing-schema-specifier-map',
    'parsing-schema-toplevel',
    'parsing-scope-keys',
    'parsing-specifier-keys',
    'parsing-trailing-slashes',
    'resolving-null',
    'scopes-exact-vs-prefix',
    'scopes',
    'tricky-specifiers',
    'url-specifiers',
  ];

  for (const testFile of testFiles) {
    const testCase = JSON.parse(
      fs.readFileSync(new URL(`json/${testFile}.json`, pathToFileURL(__filename)), 'utf-8'),
    );
    runTests(testCase);
  }
});
