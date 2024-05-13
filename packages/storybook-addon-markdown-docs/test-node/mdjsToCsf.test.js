/** @typedef {import('@mdjs/core').MdjsProcessPlugin} MdjsProcessPlugin */

// @ts-ignore
const chaiSnapshot = require('mocha-chai-snapshot');
const { mdjsToCsf } = require('../src/mdjsToCsf.js');

describe('mdjsToCsf', async () => {
  let expect;
  before(async () => {
    const chai = await import('chai');
    expect = chai.use(chaiSnapshot).expect;
  });

  it('transforms a mdjs file to csf', async function it() {
    const input = [
      '```js script',
      'export default { title: "My docs" }',
      '```',
      '',
      '# Title',
      '',
      'Codeblock:',
      '```js',
      'console.log("foo");',
      '```',
      '',
      '## Subtitle',
      '',
      '- A',
      '- B',
      '```js story',
      'export const MyStory = () => html`<div>My story</div>`',
      '```',
      '',
      '```js preview-story',
      'export const MyOtherStory = () => html`<div>My other story</div>`',
      '```',
      '',
      '## API',
      '',
      '<sb-props of="my-component"></sb-props>',
    ].join('\n');

    const output = (await mdjsToCsf(input, '/foo.js')).split('\n');
    // @ts-ignore
    expect(output).to.matchSnapshot(this);
  });

  it('passes on filePath and options to mdjsToMd', async () => {
    let resultPlugins = [];
    let resultFilePath;
    const input = [
      '```js script',
      'export default { title: "My docs" }',
      '```',
      '',
      '# Title',
    ].join('\n');
    /**
     * @param {MdjsProcessPlugin[]} plugins
     * @param {string} filePath
     */
    function setupMdjsPlugins(plugins, filePath) {
      resultPlugins = plugins;
      resultFilePath = filePath;
      return plugins;
    }
    await mdjsToCsf(input, '/foo.js', 'web-components', {
      setupMdjsPlugins,
    });
    expect(resultPlugins.length).to.equal(6);
    expect(resultFilePath).to.equal('/foo.js');
  });
});
