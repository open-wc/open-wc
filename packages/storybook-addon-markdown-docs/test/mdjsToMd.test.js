const { expect } = require('chai');

const { mdjsToMd } = require('../src/mdjsToMd');

/**
 * @param {string} output
 * @returns {string[]}
 */
function transformOutput(output) {
  return output.split('\n').map(line => line.trim());
}

describe('mdjsToMd', () => {
  it('transforms mdjs to html', async () => {
    const input = [
      //
      '# Title',
      '',
      'Lorem ipsum',
      '',
      '## Subtitle',
      '',
      '- A',
      '- B',
    ].join('\n');
    const mdResult = await mdjsToMd(input);
    const output = transformOutput(mdResult.html);

    expect(output).to.eql([
      '<h1 id="title">Title</h1>',
      '<p>Lorem ipsum</p>',
      '<h2 id="subtitle">Subtitle</h2>',
      '<ul>',
      '<li>A</li>',
      '<li>B</li>',
      '</ul>',
      '',
    ]);
  });

  it('preserves codeblocks', async () => {
    const input = [
      //
      '# Title',
      '',
      '```js',
      "const foo = 'bar'",
      '```',
      '',
      '```html',
      '<my-element foo="bar"></my-element>',
      '```',
    ].join('\n');

    const mdResult = await mdjsToMd(input);
    const output = transformOutput(mdResult.html);

    expect(output).to.eql([
      '<h1 id="title">Title</h1>',
      '',
      '```js',
      "const foo = 'bar'",
      '```',
      '',
      '```html',
      '<my-element foo="bar"></my-element>',
      '```',
      '',
    ]);
  });

  it('turns story and preview codeblocks into jsx elements', async () => {
    const input = [
      //
      '# Title',
      '```js story',
      'export const MyStory = () => html`<div>Hello world></div>`',
      '```',
      '',
      '```js preview-story',
      'export const YourStory = () => html`<div>Goodbye world></div>`',
      '```',
    ].join('\n');

    const mdResult = await mdjsToMd(input);
    const output = transformOutput(mdResult.html);

    expect(output).to.eql([
      //
      '<h1 id="title">Title</h1>',
      '<Story name="MyStory"></Story>',
      '<Preview><Story name="YourStory"></Story></Preview>',
      '',
    ]);
  });

  it('turns <sb-props> into <Props> elements', async () => {
    const input = [
      //
      '# Title',
      '<sb-props of="keep-it"></sb-props>',
    ].join('\n');

    const mdResult = await mdjsToMd(input);
    const output = transformOutput(mdResult.html);

    expect(output).to.eql([
      //
      '<h1 id="title">Title</h1>',
      '<Props of="keep-it" />',
      '',
    ]);
  });

  it('extracts code from stories', async () => {
    const input = [
      //
      '# Title',
      '```js story',
      'export const MyStory = () => html`<div>Hello world></div>`',
      '```',
      '',
      '```js preview-story',
      'export const YourStory = () => html`<div>Goodbye world></div>`',
      '```',
    ].join('\n');

    const output = await mdjsToMd(input);

    expect(output.stories).to.eql([
      {
        code: 'export const MyStory = () => html`<div>Hello world></div>`',
        key: 'MyStory',
        name: 'MyStory',
      },
      {
        code: 'export const YourStory = () => html`<div>Goodbye world></div>`',
        key: 'YourStory',
        name: 'YourStory',
      },
    ]);
  });
});
