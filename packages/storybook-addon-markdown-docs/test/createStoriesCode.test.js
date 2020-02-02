/** @typedef {import('@mdjs/core').Story} Story */

const { expect } = require('chai');
const { createStoriesCode } = require('../src/createStoriesCode');

describe('createStoriesCode', () => {
  it('returns a single stories as js string', () => {
    /** @type {Story[]} */
    const stories = [
      {
        key: 'StoryA',
        name: 'StoryA',
        code: 'export const StoryA = () => html`<div>Hello world</div>`',
      },
    ];
    expect(createStoriesCode(stories).trim()).to.eql(
      `export const StoryA = () => html\`<div>Hello world</div>\`
StoryA.story = StoryA.story || {};
StoryA.story.parameters = StoryA.story.parameters || {};
StoryA.story.parameters.mdxSource = "export const StoryA = () => html\`<div>Hello world</div>\`";`,
    );
  });

  it('returns multiple stories as js string', () => {
    /** @type {Story[]} */
    const stories = [
      {
        key: 'StoryA',
        name: 'StoryA',
        code: 'export const StoryA = () => html`<div>Hello world</div>`',
      },
      {
        key: 'StoryB',
        name: 'StoryB',
        code: 'export const StoryB = () => html`<div>Hello world</div>`',
      },
    ];
    expect(createStoriesCode(stories).trim()).to.eql(
      `export const StoryA = () => html\`<div>Hello world</div>\`
StoryA.story = StoryA.story || {};
StoryA.story.parameters = StoryA.story.parameters || {};
StoryA.story.parameters.mdxSource = "export const StoryA = () => html\`<div>Hello world</div>\`";

export const StoryB = () => html\`<div>Hello world</div>\`
StoryB.story = StoryB.story || {};
StoryB.story.parameters = StoryB.story.parameters || {};
StoryB.story.parameters.mdxSource = "export const StoryB = () => html\`<div>Hello world</div>\`";`,
    );
  });

  it('sets the story name if it is different from the key', () => {
    /** @type {Story[]} */
    const stories = [
      {
        key: 'StoryA',
        name: 'Story A',
        code: 'export const StoryA = () => html`<div>Hello world</div>`',
      },
    ];
    expect(createStoriesCode(stories).trim()).to.eql(
      `export const StoryA = () => html\`<div>Hello world</div>\`
StoryA.story = StoryA.story || {};
StoryA.story.name = "Story A";
StoryA.story.parameters = StoryA.story.parameters || {};
StoryA.story.parameters.mdxSource = "export const StoryA = () => html\`<div>Hello world</div>\`";`,
    );
  });

  it('handles a multiline story', () => {
    /** @type {Story[]} */
    const stories = [
      {
        key: 'StoryA',
        name: 'Story A',
        code: `export const StoryA = () => html\`
  <div>Hello world</div>
\`;`,
      },
    ];
    expect(createStoriesCode(stories).trim()).to.eql(
      `export const StoryA = () => html\`
  <div>Hello world</div>
\`;
StoryA.story = StoryA.story || {};
StoryA.story.name = "Story A";
StoryA.story.parameters = StoryA.story.parameters || {};
StoryA.story.parameters.mdxSource = "export const StoryA = () => html\`\\n  <div>Hello world</div>\\n\`;";`,
    );
  });

  it('throws when given invalid input', () => {
    // @ts-ignore
    expect(() => createStoriesCode([{ code: 'console.log("hello world");' }])).to.throw();
    // @ts-ignore
    expect(() => createStoriesCode([{ key: 'Story A' }])).to.throw();
  });
});
