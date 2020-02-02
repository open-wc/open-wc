/* eslint-disable no-template-curly-in-string */

const chai = require('chai');
const { mdjsProcess } = require('../src/mdjsProcess.js');

const { expect } = chai;

describe('mdjsProcess', () => {
  const input = [
    'Intro',
    '```js',
    'const foo = 1;',
    '```',
    '```js script',
    'const bar = 2;',
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
      '<p>Intro</p>',
      '<pre><code class="language-js">const foo = 1;',
      '</code></pre>',
      '<mdjs-story mdjs-story-name="fooStory"></mdjs-story>',
      '<mdjs-preview mdjs-story-name="fooPreviewStory"></mdjs-preview>',
    ].join('\n');
    const expectedJsCode = [
      "import '@mdjs/mdjs-story/mdjs-story.js';",
      "import '@mdjs/mdjs-preview/mdjs-preview.js';",
      'const bar = 2;',
      'export const fooStory = () => {}',
      'export const fooPreviewStory = () => {}',
      'const rootNode = document;',
      `const stories = [{ key: 'fooStory', story: fooStory, code: fooStory }, { key: 'fooPreviewStory', story: fooPreviewStory, code: fooPreviewStory }];`,
      'for (const story of stories) {',
      '  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);',
      '  storyEl.story = story.story;',
      '  storyEl.code = story.code;',
      '};',
    ].join('\n');

    const result = await mdjsProcess(input);
    expect(result.html).to.equal(expected);
    expect(result.jsCode).to.equal(expectedJsCode);
  });

  it('allows to configure the marker tags', async () => {
    const expected = [
      '<p>Intro</p>',
      '<pre><code class="language-js">const foo = 1;',
      '</code></pre>',
      '<my-story mdjs-story-name="fooStory"></my-story>',
      '<my-preview mdjs-story-name="fooPreviewStory"></my-preview>',
    ].join('\n');

    const result = await mdjsProcess(input, {
      mdjsStoryParseOptions: {
        storyTag: name => `<my-story mdjs-story-name="${name}"></my-story>`,
        previewStoryTag: name => `<my-preview mdjs-story-name="${name}"></></my-preview>`,
      },
    });

    expect(result.html).to.equal(expected);
  });
});
