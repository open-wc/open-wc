import { expect } from '@bundled-es-modules/chai';
import getDiffableHTML from '../src/get-diffable-html';

/**
 * TODO:
 * - script
 * - svg
 * - style
 * - void
 * - comments
 * - meta
 * - doctpyes
 * - real documents
 * - ignored tags
 * - ignored light dom
 * - real life examples
 */

describe('getDiffableHTML()', () => {
  describe('indentation', () => {
    it('one level', () => {
      const html = getDiffableHTML('<div></div>');
      expect(html).to.equal('<div>\n' + '</div>\n');
    });

    it('multiple levels', () => {
      const html = getDiffableHTML('<div><span><div></div></span></div>');
      expect(html).to.equal(
        '<div>\n' + '  <span>\n' + '    <div>\n' + '    </div>\n' + '  </span>\n' + '</div>\n',
      );
    });

    it('siblings', () => {
      const html = getDiffableHTML('<div></div><div></div>');
      expect(html).to.equal('<div>\n' + '</div>\n' + '<div>\n' + '</div>\n');
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
      expect(html).to.equal('<div>\n' + '</div>\n' + '<div>\n' + '</div>\n');
    });

    it('removes tab, return and line feed characters', () => {
      const html = getDiffableHTML('<div>\n\t\r\n\t\r\n\t\r</div>');
      expect(html).to.equal('<div>\n' + '</div>\n');
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
      expect(html).to.equal('<div>\n' + '  foo\n' + '</div>\n');
    });

    it('trims tabs, return and line feeds around text nodes', () => {
      const html = getDiffableHTML('<div>\t\n\r foo  </div>\t\r\n');
      expect(html).to.equal('<div>\n' + '  foo\n' + '</div>\n');
    });

    it('preserves whitespace between text', () => {
      const html = getDiffableHTML('<div>    foo    bar    baz</div>');
      expect(html).to.equal('<div>\n' + '  foo    bar    baz\n' + '</div>\n');
    });

    it('preserves tab, return and line feed between text', () => {
      const html = getDiffableHTML('<div>    foo\nbar\r \nbaz \t lorem</div>');
      expect(html).to.equal(
        '<div>\n' + '  foo\n' + 'bar\n' + ' \n' + 'baz \t lorem\n' + '</div>\n',
      );
    });
  });

  describe('attributes', () => {
    it('one attribute', () => {
      const html = getDiffableHTML('<div foo="bar"></div>');
      expect(html).to.equal('<div foo="bar">\n' + '</div>\n');
    });

    it('multiple attributes', () => {
      const html = getDiffableHTML('<div foo="bar" lorem="ipsum"></div>');
      expect(html).to.equal('<div\n' + '  foo="bar"\n' + '  lorem="ipsum"\n' + '>\n' + '</div>\n');
    });

    it('sorts attributes alphabetically', () => {
      const html = getDiffableHTML('<div b="2" a="1" c="3"></div>');
      expect(html).to.equal(
        '<div\n' + '  a="1"\n' + '  b="2"\n' + '  c="3"\n' + '>\n' + '</div>\n',
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
  });

  describe('non-HTML elements', () => {
    it('does not sprint script content, but preserves attributes', () => {
      const html = getDiffableHTML(`
        <div>pre</div>
        <script>
          console.log('hi');
        </script>
        <script type="module" src="./foo.js"></script>
        <div>post</div>
        `);
      expect(html).to.equal(
        '<div>\n' +
          '  pre\n' +
          '</div>\n' +
          '<script>\n' +
          '</script>\n' +
          '<script\n' +
          '  src="./foo.js"\n' +
          '  type="module"\n' +
          '>\n' +
          '</script>\n' +
          '<div>\n' +
          '  post\n' +
          '</div>\n',
      );
    });

    it('does not sprint style content, but preserves attributes', () => {
      const html = getDiffableHTML(`
        <div>pre</div>
        <style scope="foo">
          .foo { color: blue; }
        </style>
        <div>post</div>
        `);
      expect(html).to.equal(
        '<div>\n' +
          '  pre\n' +
          '</div>\n' +
          '<style scope="foo">\n' +
          '</style>\n' +
          '<div>\n' +
          '  post\n' +
          '</div>\n',
      );
    });
  });
});
