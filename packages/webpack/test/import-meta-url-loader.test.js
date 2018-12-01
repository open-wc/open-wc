import chai from 'chai';
import path from 'path';
import compiler from './compiler.js';

const { expect } = chai;

const rules = [{
  test: /\.js$/,
  loader: path.resolve(__dirname, '../loaders/import-meta-url-loader.js'),
}];

const rootRegex = /((?:\/[^/\r\n]*))$/g;
const rootFunction = "window.location.href.replace(/((?:\\/[^/\\r\\n]*))$/g, '')";

describe('root url regex', () => {
  it('Returns always an url without a trailing /', () => {
    // Note: we use window.location.href which will always have a trailing /
    // so we do not need to support cases without
    expect('http://domain.com/'.replace(rootRegex, '')).to.equal('http://domain.com');
    expect('http://domain.com/index.html'.replace(rootRegex, '')).to.equal('http://domain.com');
    expect('http://domain.com/index.js'.replace(rootRegex, '')).to.equal('http://domain.com');
    expect('http://domain.com/index.js?foo=bar'.replace(rootRegex, '')).to.equal('http://domain.com');
    expect('http://domain.com/foo/'.replace(rootRegex, '')).to.equal('http://domain.com/foo');
    expect('http://domain.com/foo/?foo=bar'.replace(rootRegex, '')).to.equal('http://domain.com/foo');
    expect('http://domain.com/foo/bar/?foo=bar'.replace(rootRegex, '')).to.equal('http://domain.com/foo/bar');
  });
});

describe('import-meta-url-loader', () => {
  it('Replaces all instances of import.meta', async () => {
    const stats = await compiler('caseA/index.js', rules);
    const caseA = stats.toJson().modules[0].source;

    expect(caseA).to.equal(''
      + `export const foo = new URL('./', ({ url: ${rootFunction} + '/caseA/index.js' }).url);\n`
      + `export const bar = new URL('./', ({ url: ${rootFunction} + '/caseA/index.js' }).url);\n`);

    const statsReturn = await compiler('caseA/return.js', rules);
    const caseAreturn = statsReturn.toJson().modules[0].source;
    expect(caseAreturn).to.equal(`export const foo = () => ({ url: ${rootFunction} + '/caseA/return.js' });\n`);
  });

  it('Replaces nested instances of import.meta', async () => {
    const stats = await compiler('caseB/index.js', rules);
    const caseB = stats.toJson().modules[0].source;
    const caseBsub = stats.toJson().modules[1].source;

    expect(caseB).to.equal(''
      + `import './caseBsub/caseBsub';\n` // eslint-disable-line quotes
      + '\n'
      + `window.foo = new URL('./', ({ url: ${rootFunction} + '/caseB/index.js' }).url);\n`);

    expect(caseBsub).to.equal(`window.bar = new URL('./', ({ url: ${rootFunction} + '/caseB/caseBsub/caseBsub.js' }).url);\n`);
  });
});
