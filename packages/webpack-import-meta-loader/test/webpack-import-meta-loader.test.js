/* eslint-disable no-template-curly-in-string */

import chai from 'chai';
import path from 'path';
import { EOL as newLine } from 'os';
import compiler from './compiler.js';

const { expect } = chai;

const rules = [
  {
    test: /\.js$/,
    loader: path.resolve(__dirname, '../webpack-import-meta-loader.js'),
  },
];
function getOnlyDynamicSource(source) {
  return source.split('\n').splice(18).join(newLine);
}

describe('import-meta-url-loader', () => {
  it('Replaces all instances of import.meta', async () => {
    const stats = await compiler('caseA/index.js', rules);
    const caseA = getOnlyDynamicSource(stats.toJson().modules[0].source);

    expect(caseA).to.equal(
      `${"export const foo = new URL('./', ({ url: getAbsoluteUrl('caseA/index.js') }).url);"}${newLine}export const bar = new URL('./', ({ url: getAbsoluteUrl('caseA/index.js') }).url);${newLine}`,
    );

    const statsReturn = await compiler('caseA/return.js', rules);
    const caseAreturn = getOnlyDynamicSource(statsReturn.toJson().modules[0].source);
    // eslint-disable-next-line quotes
    expect(caseAreturn).to.equal(
      `export const foo = () => ({ url: getAbsoluteUrl('caseA/return.js') });${newLine}`,
    );
  });

  it('Replaces nested instances of import.meta', async () => {
    const stats = await compiler('caseB/index.js', rules);
    const caseB = getOnlyDynamicSource(stats.toJson().modules[1].source);
    const caseBsub = getOnlyDynamicSource(stats.toJson().modules[0].source);

    expect(caseB).to.equal(
      `${"import './caseBsub/caseBsub.js';"}${newLine}${newLine}export const foo = new URL('./', ({ url: getAbsoluteUrl('caseB/index.js') }).url);${newLine}`,
    );

    expect(caseBsub).to.equal(
      `export const bar = new URL('./', ({ url: getAbsoluteUrl('caseB/caseBsub/caseBsub.js') }).url);${newLine}`,
    );
  });
});
