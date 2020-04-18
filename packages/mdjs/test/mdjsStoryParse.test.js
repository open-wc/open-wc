/* eslint-disable no-template-curly-in-string */

const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');

const chai = require('chai');
const { mdjsStoryParse } = require('../src/mdjsStoryParse.js');

const { expect } = chai;

describe('mdjsStoryParse', () => {
  const input = [
    '## Intro',
    '```js',
    'const foo = 1;',
    '```',
    '```js story',
    'export const fooStory = () => {}',
    '```',
    '```js preview-story',
    'export const fooPreviewStory = () => {}',
    '```',
  ].join('\n');

  it('extracts code blocks with "js story" and "js preview-story" and places marker tags', async () => {
    const expected = [
      '<h2>Intro</h2>',
      '<pre><code class="language-js">const foo = 1;',
      '</code></pre>',
      '<mdjs-story mdjs-story-name="fooStory"></mdjs-story>',
      '<mdjs-preview mdjs-story-name="fooPreviewStory"></mdjs-preview>',
      '',
    ].join('\n');

    const parser = unified()
      .use(markdown)
      .use(mdjsStoryParse)
      .use(html);
    const result = await parser.process(input);
    expect(result.contents).to.equal(expected);
    // @ts-ignore
    expect(result.data.stories).to.deep.equal([
      {
        key: 'fooStory',
        name: 'fooStory',
        code: 'export const fooStory = () => {}',
      },
      {
        key: 'fooPreviewStory',
        name: 'fooPreviewStory',
        code: 'export const fooPreviewStory = () => {}',
      },
    ]);
  });

  it('allows to configure the marker tags', async () => {
    const expected = [
      '<h2>Intro</h2>',
      '<pre><code class="language-js">const foo = 1;',
      '</code></pre>',
      '<Story name="fooStory"></Story>',
      '<Preview><Story name="fooPreviewStory"></Story></Preview>',
      '',
    ].join('\n');

    const parser = unified()
      .use(markdown)
      .use(mdjsStoryParse, {
        storyTag: name => `<Story name="${name}"></Story>`,
        previewStoryTag: name => `<Preview><Story name="${name}"></Story></Preview>`,
      })
      .use(html);
    const result = await parser.process(input);
    expect(result.contents).to.equal(expected);
  });
});
