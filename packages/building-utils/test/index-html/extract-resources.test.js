const { expect } = require('chai');
const { extractResources } = require('../../index-html');
const { queryAll, predicates } = require('../../dom5-fork');

describe('extract-resources', () => {
  it('returns any resources found', () => {
    const html = `
      <html>
        <head>
          <script type="module" src="file-a.js"></script>
        </head>
        <body>
          <script type="module" src="file-b.js"></script>
          <script type="module"></script>
          <script type="module" src="file-c.js"></script>
        </body>
      </html>
    `;

    const result = extractResources(html);
    expect(result.jsModules).to.eql(['file-a.js', 'file-b.js', 'file-c.js']);
  });

  it('removes resources from ast', () => {
    const html = `
      <html>
        <head>
          <script type="module" src="file-a.js"></script>
        </head>
        <body>
          <script type="module" src="file-b.js"></script>
          <script type="module"></script>
          <script type="module" src="file-c.js"></script>
        </body>
      </html>
    `;

    const result = extractResources(html);
    expect(queryAll(result.indexHTML, predicates.hasTagName('script')).length).to.equal(1);
  });
});
