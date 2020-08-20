/* eslint-disable no-useless-concat */
import { expect } from './bdd-setup.js';
import { getDiffableHTML } from '../index.js';

describe('getDiffableHTML()', () => {
  describe('indentation', () => {
    it('one level', () => {
      const html = getDiffableHTML('<div></div>');
      expect(html).to.equal('<div>\n' + '</div>\n');
    });

    it('multiple levels', () => {
      const html = getDiffableHTML('<div><span><div></div></span></div>');

      // prettier-ignore
      expect(html).to.equal(
        '<div>\n' +
        '  <span>\n' +
        '    <div>\n' +
        '    </div>\n' +
        '  </span>\n' +
        '</div>\n',
      );
    });

    it('siblings', () => {
      const html = getDiffableHTML('<div></div><div></div>');

      // prettier-ignore
      expect(html).to.equal(
        '<div>\n' +
        '</div>\n' +
        '<div>\n' +
        '</div>\n',
      );
    });

    it('levels and siblings', () => {
      const html = getDiffableHTML(`
          <div>
            <div>
              <span></span>
              <span>
                <div>
                  <span></span>
                </div>
                <div></div>
              </span>
              <span></span>
            </div>
          </div>
          <div></div>
        `);

      // prettier-ignore
      expect(html).to.equal(
        '<div>\n' +
        '  <div>\n' +
        '    <span>\n' +
        '    </span>\n' +
        '    <span>\n' +
        '      <div>\n' +
        '        <span>\n' +
        '        </span>\n' +
        '      </div>\n' +
        '      <div>\n' +
        '      </div>\n' +
        '    </span>\n' +
        '    <span>\n' +
        '    </span>\n' +
        '  </div>\n' +
        '</div>\n' +
        '<div>\n' +
        '</div>\n',
      );
    });
  });

  describe('text and comments', () => {
    it('removes empty text nodes', () => {
      const html = getDiffableHTML('<div>           </div><div> </div>');

      // prettier-ignore
      expect(html).to.equal(
        '<div>\n' +
        '</div>\n' +
        '<div>\n' +
        '</div>\n',
      );
    });

    it('removes tab, return and line feed characters', () => {
      const html = getDiffableHTML('<div>\n\t\r\n\t\r\n\t\r</div>');

      // prettier-ignore
      expect(html).to.equal(
        '<div>\n' +
        '</div>\n',
      );
    });

    it('prints text at different depths', () => {
      const html = getDiffableHTML(`
          <div>
          foo
          <div>bar
            <span>baz</span>
            <span>buz</span>
            foo bar baz
          </div>
          </div>
        `);

      // prettier-ignore
      expect(html).to.equal(
        '<div>\n' +
        '  foo\n' +
        '  <div>\n' +
        '    bar\n' +
        '    <span>\n' +
        '      baz\n' +
        '    </span>\n' +
        '    <span>\n' +
        '      buz\n' +
        '    </span>\n' +
        '    foo bar baz\n' +
        '  </div>\n' +
        '</div>\n',
      );
    });

    it('trims whitespace around text nodes', () => {
      const html = getDiffableHTML('<div>    foo  </div>');

      // prettier-ignore
      expect(html).to.equal(
        '<div>\n' +
        '  foo\n' +
        '</div>\n',
      );
    });

    it('trims tabs, return and line feeds around text nodes', () => {
      const html = getDiffableHTML('<div>\t\n\r foo  </div>\t\r\n');

      // prettier-ignore
      expect(html).to.equal(
        '<div>\n' +
        '  foo\n' +
        '</div>\n',
      );
    });

    it('preserves whitespace between text', () => {
      const html = getDiffableHTML('<div>    foo    bar    baz</div>');

      // prettier-ignore
      expect(html).to.equal(
        '<div>\n' +
        '  foo    bar    baz\n' +
        '</div>\n',
      );
    });

    it('preserves tab, return and line feed between text', () => {
      const html = getDiffableHTML('<div>    foo\nbar\r \nbaz \t lorem</div>');

      // prettier-ignore
      expect(html).to.equal(
        '<div>\n' +
        '  foo\n' +
        'bar\n' +
        ' \n' +
        'baz \t lorem\n' +
        '</div>\n',
      );
    });

    it('removes comments', () => {
      const html = getDiffableHTML(`
        <!-- some comment -->
        <div>
          <!-- foo -->
          <span>
            lorem
            <!-- foo -->
            ipsum
          </span>
          <!-- <div id="bar"></div> -->
        </div>
      `);

      // prettier-ignore
      expect(html).to.equal(
        '<div>\n' +
        '  <span>\n' +
        '    lorem\n' +
        '    ipsum\n' +
        '  </span>\n' +
        '</div>\n',
      );
    });
  });

  describe('attributes', () => {
    it('one attribute', () => {
      const html = getDiffableHTML('<div foo="bar"></div>');

      // prettier-ignore
      expect(html).to.equal(
        '<div foo="bar">\n' +
        '</div>\n',
      );
    });

    it('multiple attributes', () => {
      const html = getDiffableHTML('<div foo="bar" lorem="ipsum"></div>');

      // prettier-ignore
      expect(html).to.equal(
        '<div\n' +
        '  foo="bar"\n' +
        '  lorem="ipsum"\n' +
        '>\n' +
        '</div>\n',
      );
    });

    it('sorts attributes alphabetically', () => {
      const html = getDiffableHTML('<div b="2" a="1" c="3"></div>');

      // prettier-ignore
      expect(html).to.equal(
        '<div\n' +
        '  a="1"\n' +
        '  b="2"\n' +
        '  c="3"\n' +
        '>\n' +
        '</div>\n',
      );
    });

    it('attributes at multiple depths, with text content', () => {
      const html = getDiffableHTML(`
          <div foo1="bar1" foo2="bar2">
            Some text
            <div lorem="ipsum">
              <span>
                Lorem Ipsum
                <div foo="bar" x="y" z="r"></div>
              </span>
              <span lorem-ipsum="foo"></span>
            </div>
          </div>
          <div foo2="bar2">X</div>
        `);
      expect(html).to.equal(
        '<div\n' +
          '  foo1="bar1"\n' +
          '  foo2="bar2"\n' +
          '>\n' +
          '  Some text\n' +
          '  <div lorem="ipsum">\n' +
          '    <span>\n' +
          '      Lorem Ipsum\n' +
          '      <div\n' +
          '        foo="bar"\n' +
          '        x="y"\n' +
          '        z="r"\n' +
          '      >\n' +
          '      </div>\n' +
          '    </span>\n' +
          '    <span lorem-ipsum="foo">\n' +
          '    </span>\n' +
          '  </div>\n' +
          '</div>\n' +
          '<div foo2="bar2">\n' +
          '  X\n' +
          '</div>\n',
      );
    });

    it('excess class attribute whitespace is removed', () => {
      const html = getDiffableHTML(`
          <div class="1"></div>
          <div class="1 2"></div>
          <div class="1 2 3 "></div>
          <div class=" 1 "></div>
          <div class="   1 2"></div>
          <div class="  1   2"></div>
        `);
      expect(html).to.equal(
        '<div class="1">\n' +
          '</div>\n' +
          '<div class="1 2">\n' +
          '</div>\n' +
          '<div class="1 2 3">\n' +
          '</div>\n' +
          '<div class="1">\n' +
          '</div>\n' +
          '<div class="1 2">\n' +
          '</div>\n' +
          '<div class="1 2">\n' +
          '</div>\n',
      );
    });

    it('class attributes are sorted', () => {
      const html = getDiffableHTML(`
        <div class=" 2 1 3"></div>
        <div class="z 4 b a"></div>
        `);
      expect(html).to.equal(
        '<div class="1 2 3">\n' + '</div>\n' + '<div class="4 a b z">\n' + '</div>\n',
      );
    });

    it('removes empty class attributes', () => {
      const html = getDiffableHTML(`
        <div id="with-quotes" class=""></div>
        <div id="without-quotes" class></div>
        `);
      expect(html).to.equal(
        `<div id="with-quotes">
</div>
<div id="without-quotes">
</div>
`,
      );
    });

    it('removes class attributes that contains only whitespaces', () => {
      const html = getDiffableHTML(`
        <div class="  "></div>
        `);
      expect(html).to.equal('<div>\n</div>\n');
    });

    it('escapes attributes that require it', () => {
      const html = getDiffableHTML(`
        <div a="i &quot;have&quot; quotes" b="attributes &amp; values" c="with &quot;quotes&quot; &amp; amps"></div>
      `);

      // prettier-ignore
      expect(html).to.equal(
        '<div\n' +
        '  a="i &quot;have&quot; quotes"\n' +
        '  b="attributes &amp; values"\n' +
        '  c="with &quot;quotes&quot; &amp; amps"\n' +
        '>\n' +
        '</div>\n'
      );
    });
  });

  describe('special elements', () => {
    it('supports void elements', () => {
      const html = getDiffableHTML(`
        <div>
          <div>before</div>
          <input placeholder="foo" value="bar">
          <div>after</div>
          <img src="./foo.png">
          <span>
            <hr>
          </span>
        </div>
        <area>
      `);
      expect(html).to.equal(
        '<div>\n' +
          '  <div>\n' +
          '    before\n' +
          '  </div>\n' +
          '  <input\n' +
          '    placeholder="foo"\n' +
          '    value="bar"\n' +
          '  >\n' +
          '  <div>\n' +
          '    after\n' +
          '  </div>\n' +
          '  <img src="./foo.png">\n' +
          '  <span>\n' +
          '    <hr>\n' +
          '  </span>\n' +
          '</div>\n' +
          '<area>\n',
      );
    });

    it('supports self closing elements', () => {
      const html = getDiffableHTML(`
        <div>
          <input placeholder="foo" value="bar" />
          <img src="./foo.png" />
        </div>
        <area />
      `);
      expect(html).to.equal(
        '<div>\n' +
          '  <input\n' +
          '    placeholder="foo"\n' +
          '    value="bar"\n' +
          '  >\n' +
          '  <img src="./foo.png">\n' +
          '</div>\n' +
          '<area>\n',
      );
    });

    it('ignores doctype', () => {
      const html = getDiffableHTML(`
        <!DOCTYPE html>
        <div>foo</div>
      `);

      // prettier-ignore
      expect(html).to.equal(
        '<div>\n' +
        '  foo\n' +
        '</div>\n',
      );
    });
  });

  describe('non-HTML elements', () => {
    it('does not print script tags', () => {
      const html = getDiffableHTML(`
        <div>pre</div>
        <script>
          console.log('hi');
        </script>
        <script type="module" src="./foo.js"></script>
        <div>post</div>
      `);
      expect(html).to.equal(
        '<div>\n' + '  pre\n' + '</div>\n' + '<div>\n' + '  post\n' + '</div>\n',
      );
    });

    it('does not print styles', () => {
      const html = getDiffableHTML(`
        <div>pre</div>
        <style scope="foo">
          .foo { color: blue; }
        </style>
        <div>post</div>
        `);
      expect(html).to.equal(
        '<div>\n' + '  pre\n' + '</div>\n' + '<div>\n' + '  post\n' + '</div>\n',
      );
    });

    it('does not print svg', () => {
      const html = getDiffableHTML(`
        <div>pre</div>
        <svg height="80" width="300" xmlns:xlink="http://www.w3.org/1999/xlink">
          <a xlink:href="https://www.w3schools.com/graphics/" target="_blank">
            <text x="0" y="15" fill="red">SVG</text>
          </a>
          <g fill="none" stroke="black">
            <path stroke-width="2" d="M5 20 l215 0" />
            <path stroke-width="4" d="M5 40 l215 0" />
            <path stroke-width="6" d="M5 60 l215 0" />
          </g>
        </svg>
        <div>post</div>
        `);
      expect(html).to.equal(
        '<div>\n' + '  pre\n' + '</div>\n' + '<div>\n' + '  post\n' + '</div>\n',
      );
    });
  });

  describe('diff options', () => {
    it('ignored tags', () => {
      const html = getDiffableHTML(
        `<div>
          <div>A</div>
          <span>
            <div>B</div>
              <span>
                <div>C</div>
                <div>D</div>
              </span>
            <div>E</div>
            <div>F</div>
          </span>
          <div>G</div>
        </div>
      `,
        { ignoreTags: ['span'] },
      );
      expect(html).to.equal(
        '<div>\n' +
          '  <div>\n' +
          '    A\n' +
          '  </div>\n' +
          '  <div>\n' +
          '    G\n' +
          '  </div>\n' +
          '</div>\n',
      );
    });

    it('ignored attributes', () => {
      const html = getDiffableHTML(
        `
        <div foo="bar">
          <div class="foo">A</div>
          <span foo="bar" bar="foo">
            <div foo="baz">B</div>
            <div>E</div>
          </span>
          <div foo="foo">F</div>
        </div>
      `,
        { ignoreAttributes: ['foo'] },
      );
      expect(html).to.equal(
        '<div>\n' +
          '  <div class="foo">\n' +
          '    A\n' +
          '  </div>\n' +
          '  <span bar="foo">\n' +
          '    <div>\n' +
          '      B\n' +
          '    </div>\n' +
          '    <div>\n' +
          '      E\n' +
          '    </div>\n' +
          '  </span>\n' +
          '  <div>\n' +
          '    F\n' +
          '  </div>\n' +
          '</div>\n',
      );
    });

    it('ignored attributes for tags', () => {
      const html = getDiffableHTML(
        `
        <div foo="bar">
          <div class="foo">A</div>
          <my-element foo="bar" foo2="bar"></my-element>
          <span foo="bar" bar="foo">
            <div foo="baz" bar="foo">B</div>
            <div>E</div>
          </span>
          <div foo="foo">F</div>
        </div>
      `,
        {
          ignoreAttributes: [{ tags: ['my-element', 'div'], attributes: ['foo', 'foo2'] }],
        },
      );
      expect(html).to.equal(
        '<div>\n' +
          '  <div class="foo">\n' +
          '    A\n' +
          '  </div>\n' +
          '  <my-element>\n' +
          '  </my-element>\n' +
          '  <span\n' +
          '    bar="foo"\n' +
          '    foo="bar"\n' +
          '  >\n' +
          '    <div bar="foo">\n' +
          '      B\n' +
          '    </div>\n' +
          '    <div>\n' +
          '      E\n' +
          '    </div>\n' +
          '  </span>\n' +
          '  <div>\n' +
          '    F\n' +
          '  </div>\n' +
          '</div>\n',
      );
    });

    it('throws on invalid options', () => {
      try {
        getDiffableHTML(`<div foo="bar"></div>`, {
          // @ts-ignore
          ignoreAttributes: [{ tags: ['div'] }],
        });
        throw new Error('should not resolve');
      } catch (error) {
        expect(error.message).to.equal(
          "An object entry to ignoreAttributes should contain a 'tags' and an 'attributes' property.",
        );
      }
    });

    describe('ignoredChildren', () => {
      it('no children', () => {
        const html = getDiffableHTML('<my-element foo="bar" foo2="bar"></my-element>', {
          ignoreChildren: ['my-element'],
        });

        // prettier-ignore
        expect(html).to.equal(
          '<my-element\n' +
          '  foo="bar"\n' +
          '  foo2="bar"\n' +
          '>\n' +
          '</my-element>\n',
        );
      });
    });

    it('light dom text', () => {
      const html = getDiffableHTML(
        `
        <my-element foo="bar" foo2="bar">
          light dom
        </my-element>
      `,
        {
          ignoreChildren: ['my-element'],
        },
      );

      // prettier-ignore
      expect(html).to.equal(
        '<my-element\n' +
        '  foo="bar"\n' +
        '  foo2="bar"\n' +
        '>\n' +
        '</my-element>\n',
      );
    });

    it('two light dom text nodes', () => {
      const html = getDiffableHTML(
        `
        <my-element foo="bar" foo2="bar">
          light dom 1
          <!-- comment to create a second text node -->
          light dom 2
        </my-element>
      `,
        { ignoreChildren: ['my-element'] },
      );

      // prettier-ignore
      expect(html).to.equal(
        '<my-element\n' +
        '  foo="bar"\n' +
        '  foo2="bar"\n' +
        '>\n' +
        '</my-element>\n',
      );
    });

    it('light dom node', () => {
      const html = getDiffableHTML(
        `
        <my-element foo="bar" foo2="bar">
          <div>light dom</div>
        </my-element>
      `,
        { ignoreChildren: ['my-element'] },
      );

      // prettier-ignore
      expect(html).to.equal(
        '<my-element\n' +
        '  foo="bar"\n' +
        '  foo2="bar"\n' +
        '>\n' +
        '</my-element>\n',
      );
    });

    it('two light dom nodes', () => {
      const html = getDiffableHTML(
        `
        <my-element foo="bar" foo2="bar">
          <div>light dom 1</div>
          <div>light dom 2</div>
        </my-element>
      `,
        { ignoreChildren: ['my-element'] },
      );

      // prettier-ignore
      expect(html).to.equal(
        '<my-element\n' +
        '  foo="bar"\n' +
        '  foo2="bar"\n' +
        '>\n' +
        '</my-element>\n',
      );
    });

    it('attributes on light dom nodes', () => {
      const html = getDiffableHTML(
        `
        <my-element foo="bar" foo2="bar">
          <div id="foo" class="bar"></div>
          <div class="foo2" id="foo2">
            <div class="foo3" id="foo3"></div>
          </div>
        </my-element>
      `,
        { ignoreChildren: ['my-element'] },
      );

      // prettier-ignore
      expect(html).to.equal(
        '<my-element\n' +
        '  foo="bar"\n' +
        '  foo2="bar"\n' +
        '>\n' +
        '</my-element>\n',
      );
    });

    it('nested light dom', () => {
      const html = getDiffableHTML(
        `
        <my-element-1 foo="bar" foo2="bar">
          <my-element-1>
            <div>light dom 1</div>
          </my-element-1>
          <div>light dom 2</div>
          <my-element-2>
            <my-element-1>light dom 3</my-element-1>
          </my-element-2>
        </my-element-1>
      `,
        { ignoreChildren: ['my-element-1', 'my-element-2'] },
      );

      // prettier-ignore
      expect(html).to.equal(
        '<my-element-1\n' +
        '  foo="bar"\n' +
        '  foo2="bar"\n' +
        '>\n' +
        '</my-element-1>\n',
      );
    });

    it('light dom ignored in a deep tree', () => {
      const html = getDiffableHTML(
        `
        <div>
          <div class="foo">
            <div>
              <my-element-1 foo="bar">light dom 1</my-element-1>
              <my-element-1 id="x"><div>light dom 2</div></my-element-1>
            </div>
            <my-element-2 class="foo bar">
              <div>light dom 3</div>
              light dom 4
            </my-element-2>
          </div>
          <div>
            <div>
              <my-element-1 hidden>light dom 5</my-element-1>
            </div>
          </div>
        </div>
      `,
        { ignoreChildren: ['my-element-1', 'my-element-2'] },
      );

      expect(html).to.equal(
        '<div>\n' +
          '  <div class="foo">\n' +
          '    <div>\n' +
          '      <my-element-1 foo="bar">\n' +
          '      </my-element-1>\n' +
          '      <my-element-1 id="x">\n' +
          '      </my-element-1>\n' +
          '    </div>\n' +
          '    <my-element-2 class="bar foo">\n' +
          '    </my-element-2>\n' +
          '  </div>\n' +
          '  <div>\n' +
          '    <div>\n' +
          '      <my-element-1 hidden="">\n' +
          '      </my-element-1>\n' +
          '    </div>\n' +
          '  </div>\n' +
          '</div>\n',
      );
    });
  });

  it('dom node as input', () => {
    const node = document.createElement('div');
    node.setAttribute('id', 'foo');
    node.innerHTML = `
      <span>A</span>
      <span>B</span>
    `;

    const html = getDiffableHTML(node);

    expect(html).to.equal(
      '<div id="foo">\n' +
        '  <span>\n' +
        '    A\n' +
        '  </span>\n' +
        '  <span>\n' +
        '    B\n' +
        '  </span>\n' +
        '</div>\n',
    );
  });
});
