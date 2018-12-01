import chai from 'chai';
import path from 'path';
import compiler from './compiler.js';

const { expect } = chai;

const rules = [{
  test: /\.js$/,
  loader: path.resolve(__dirname, '../loaders/import-meta-url-loader.js'),
}];

it('Replaces all instances of import.meta.url', async () => {
  const stats = await compiler('caseA/index.js', rules);
  const caseA = stats.toJson().modules[0].source;

  expect(caseA).to.equal(`export const foo = new URL('./', './caseA/index.js');
export const bar = new URL('./', './caseA/index.js');
`);
});

it('Replaces nested instances of import.meta.url', async () => {
  const stats = await compiler('caseB/index.js', rules);
  const caseB = stats.toJson().modules[0].source;
  const caseBsub = stats.toJson().modules[1].source;

  expect(caseB).to.equal(`import './caseBsub/caseBsub';

window.foo = new URL('./', './caseB/index.js');
`);

  expect(caseBsub).to.equal("window.bar = new URL('./', './caseB/caseBsub/caseBsub.js');\n");
});
