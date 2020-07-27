/* eslint-disable no-template-curly-in-string */

const chai = require('chai');
const { mdjsProcess, mdjsProcessPlugins } = require('../src/mdjsProcess.js');

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
      '<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> foo <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>',
      '</code></pre>',
      '<mdjs-story mdjs-story-name="fooStory"></mdjs-story>',
      '<mdjs-preview mdjs-story-name="fooPreviewStory"></mdjs-preview>',
    ].join('\n');
    const expectedJsCode = [
      'const bar = 2;',
      'export const fooStory = () => {}',
      'export const fooPreviewStory = () => {}',
      'const rootNode = document;',
      `const stories = [{ key: 'fooStory', story: fooStory, code: \`<pre class="language-js"><code class="language-js"><span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token function-variable function">fooStory</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>`,
      `</code></pre>\` }, { key: 'fooPreviewStory', story: fooPreviewStory, code: \`<pre class="language-js"><code class="language-js"><span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token function-variable function">fooPreviewStory</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>`,
      `</code></pre>\` }];`,
      'for (const story of stories) {',
      '  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);',
      '  storyEl.codeHasHtml = true;',
      '  storyEl.story = story.story;',
      '  storyEl.code = story.code;',
      '};',
      `if (!customElements.get('mdjs-preview')) { import('@mdjs/mdjs-preview/mdjs-preview.js'); }`,
      `if (!customElements.get('mdjs-story')) { import('@mdjs/mdjs-story/mdjs-story.js'); }`,
    ].join('\n');

    const result = await mdjsProcess(input);
    expect(result.html).to.equal(expected);
    expect(result.jsCode).to.equal(expectedJsCode);
  });

  it('has no js code if there are no stories', async () => {
    const result = await mdjsProcess('## Intro');
    expect(result.html).to.equal(
      '<h2 id="intro"><a aria-hidden="true" href="#intro"><span class="icon icon-link"></span></a>Intro</h2>',
    );
    expect(result.jsCode).to.equal('');
  });

  it('handles files which have js but no stories', async () => {
    const md = [
      //
      '## Intro',
      '```js script',
      'const bar = 2;',
      '```',
    ].join('\n');

    const result = await mdjsProcess(md);
    expect(result.html).to.equal(
      '<h2 id="intro"><a aria-hidden="true" href="#intro"><span class="icon icon-link"></span></a>Intro</h2>',
    );
    expect(result.jsCode).to.equal('const bar = 2;');
  });

  it('allows to fully configure the plugin list', async () => {
    const expected = [
      '<p>Intro</p>',
      '<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> foo <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>',
      '</code></pre>',
      '<my-story mdjs-story-name="fooStory"></my-story>',
      '<my-preview mdjs-story-name="fooPreviewStory"></my-preview>',
    ].join('\n');

    const plugins = mdjsProcessPlugins.map(pluginObj => {
      if (pluginObj.name === 'mdjsStoryParse') {
        return {
          ...pluginObj,
          options: {
            storyTag: name => `<my-story mdjs-story-name="${name}"></my-story>`,
            previewStoryTag: name => `<my-preview mdjs-story-name="${name}"></></my-preview>`,
          },
        };
      }
      return pluginObj;
    });

    const result = await mdjsProcess(input, {
      plugins,
    });

    expect(result.html).to.equal(expected);
  });
});
