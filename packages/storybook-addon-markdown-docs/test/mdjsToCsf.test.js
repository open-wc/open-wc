const chai = require('chai');
// @ts-ignore
const chaiSnapshot = require('mocha-chai-snapshot');
const { mdjsToCsf } = require('../src/mdjsToCsf');

chai.use(chaiSnapshot);
const { expect } = chai;

describe('mdjsToCsf', () => {
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
});
