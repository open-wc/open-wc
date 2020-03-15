/** @typedef {import('@mdjs/core').Story} Story */

const { expect } = require('chai');
const { compileMdToJsx, createDocsPage } = require('../src/mdToJsx');

describe('compileMdToJsx', () => {
  it('turns MD into JSX', async () => {
    const input = `
# Title

## Subtitle

- A
- B
- C
`;
    const output = (await compileMdToJsx(input, '/foo')).trim();
    expect(output).to.include('<h1>{`Title`}</h1>');
    expect(output).to.include('<h2>{`Subtitle`}</h2>');
    expect(output).to.include('<ul>');
    expect(output).to.include('<li parentName="ul">{`A`}</li>');
    expect(output).to.include('</ul>');
  });

  it('turns HTML into JSX', async () => {
    const input = `
<h1>Title</h1>

<ul>
  <li>A</li>
  <li>B</li>
  <li>C</li>
</ul>
`;
    const output = (await compileMdToJsx(input, '/foo')).trim();
    expect(output).to.include('<h1>Title</h1>');
    expect(output).to.include('<ul>');
    expect(output).to.include('<li>A</li>');
    expect(output).to.include('</ul>');
  });

  it('turns MD with HTML into JSX', async () => {
    const input = `
# Title

<ul>
  <li>A</li>
  <li>B</li>
  <li>C</li>
</ul>
`;
    const output = (await compileMdToJsx(input, '/foo')).trim();
    expect(output).to.include('<h1>{`Title`}</h1>');
    expect(output).to.include('<ul>');
    expect(output).to.include('<li>A</li>');
    expect(output).to.include('</ul>');
  });
});

describe('createDocsPage()', () => {
  it('creates a docs page default export', () => {
    expect(createDocsPage().trim()).to.equal(
      `import * as React from 'storybook-prebuilt/react.js';
import { mdx, AddContext } from 'storybook-prebuilt/addon-docs/blocks.js';

// Setup docs page
const mdxStoryNameToKey = {};
__export_default__.parameters = __export_default__.parameters || {};
__export_default__.parameters.docs = __export_default__.parameters.docs || {};
__export_default__.parameters.docs.page = () => <AddContext
  mdxStoryNameToKey={mdxStoryNameToKey}
  mdxComponentMeta={__export_default__}><MDXContent
/></AddContext>;
export default __export_default__;`,
    );
  });

  it('registers the story name to key mappings', () => {
    const input = [
      { key: 'StoryA', name: 'StoryA', code: '' },
      { key: 'StoryB', name: 'Story B', code: '' },
      { key: 'StoryC' },
    ];
    // @ts-ignore
    const output = createDocsPage(input);
    expect(output).to.include(
      'const mdxStoryNameToKey = {"StoryA":"StoryA","Story B":"StoryB","StoryC":"StoryC"};',
    );
  });
});
