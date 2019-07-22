/* eslint-disable no-restricted-syntax */
import chai from 'chai';
import { parseFromString } from '../../src/parser.js';

const { expect } = chai;

function testWarningHandler(expectedWarnings) {
  const warnings = [];
  const { warn } = console;
  console.warn = warning => {
    warnings.push(warning);
  };
  return () => {
    console.warn = warn;
    expect(warnings).to.deep.equal(expectedWarnings);
  };
}

export function expectSpecifierMap(input, baseURL, output, warnings = []) {
  const checkWarnings1 = testWarningHandler(warnings);

  expect(parseFromString(`{ "imports": ${input} }`, baseURL)).to.deep.equal({
    imports: output,
    scopes: {},
  });

  checkWarnings1();

  const checkWarnings2 = testWarningHandler(warnings);

  expect(
    parseFromString(`{ "scopes": { "https://scope.example/":  ${input} } }`, baseURL),
  ).to.deep.equal({ imports: {}, scopes: { 'https://scope.example/': output } });

  checkWarnings2();
}

export function expectScopes(inputArray, baseURL, outputArray, warnings = []) {
  const checkWarnings = testWarningHandler(warnings);

  const inputScopesAsStrings = inputArray.map(scopePrefix => `${JSON.stringify(scopePrefix)}: {}`);
  const inputString = `{ "scopes": { ${inputScopesAsStrings.join(', ')} } }`;

  const outputScopesObject = {};
  for (const outputScopePrefix of outputArray) {
    outputScopesObject[outputScopePrefix] = {};
  }

  expect(parseFromString(inputString, baseURL)).to.deep.equal({
    imports: {},
    scopes: outputScopesObject,
  });

  checkWarnings();
}

export function expectBad(input, baseURL, warnings = []) {
  const checkWarnings = testWarningHandler(warnings);
  expect(() => parseFromString(input, baseURL)).to.throw(TypeError);
  checkWarnings();
}
