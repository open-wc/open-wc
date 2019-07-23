const { expect } = require('chai');
const { extractResources } = require('../../index-html');
const { getAttribute, queryAll, predicates } = require('../../dom5-fork');

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
    expect(queryAll(result.indexHTML, predicates.hasTagName('script')).length).to.equal(0);
  });

  it('does not touch any resources which reference external sources', () => {
    const html = `
      <html>
        <head>
          <script type="module" src="file-a.js"></script>
        </head>
        <body>
          <script src="https://www.foo.com/my-script.js"></script>
          <script src="http://localhost:123/bar.js"></script>
          <script type="module" src="file-b.js"></script>
          <script type="module"></script>
          <script type="module" src="file-c.js"></script>
        </body>
      </html>
    `;

    const result = extractResources(html);
    const scripts = queryAll(result.indexHTML, predicates.hasTagName('script'));
    expect(scripts.length).to.equal(2);
    expect(getAttribute(scripts[0], 'src')).to.equal('https://www.foo.com/my-script.js');
    expect(getAttribute(scripts[1], 'src')).to.equal('http://localhost:123/bar.js');
  });
});
