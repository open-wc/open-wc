/* eslint-disable no-template-curly-in-string */

import chai from 'chai';
import path from 'path';
import compiler from './compiler.js';

const { expect } = chai;

const rules = [
  {
    test: /\.js$/,
    loader: path.resolve(__dirname, '../webpack-import-meta-loader.js'),
  },
];

describe('import-meta-url-loader', () => {
  it('Replaces all instances of import.meta', async () => {
    const stats = await compiler('caseA/index.js', rules);
    const caseA = stats.toJson().modules[0].source;

    expect(caseA).to.equal(
      '' +
        "export const foo = new URL('./', ({ url: `${window.location.protocol}//${window.location.host}/caseA/index.js` }).url);\n" +
        "export const bar = new URL('./', ({ url: `${window.location.protocol}//${window.location.host}/caseA/index.js` }).url);\n",
    );

    const statsReturn = await compiler('caseA/return.js', rules);
    const caseAreturn = statsReturn.toJson().modules[0].source;
    // eslint-disable-next-line quotes
    expect(caseAreturn).to.equal(
      'export const foo = () => ({ url: `${window.location.protocol}//${window.location.host}/caseA/return.js` });\n',
    );
  });

  it('Replaces nested instances of import.meta', async () => {
    const stats = await compiler('caseB/index.js', rules);
    const caseB = stats.toJson().modules[0].source;
    const caseBsub = stats.toJson().modules[1].source;

    expect(caseB).to.equal(
      '' +
        "import './caseBsub/caseBsub';\n" +
        '\n' +
        "window.foo = new URL('./', ({ url: `${window.location.protocol}//${window.location.host}/caseB/index.js` }).url);\n",
    );

    expect(caseBsub).to.equal(
      "window.bar = new URL('./', ({ url: `${window.location.protocol}//${window.location.host}/caseB/caseBsub/caseBsub.js` }).url);\n",
    );
  });
});
