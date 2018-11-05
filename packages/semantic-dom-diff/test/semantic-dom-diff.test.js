import { getSemanticDomDiff } from '../index.js';
import largeTemplate from './large-template';

describe('getSemanticDomDiff()', () => {
  describe('diffs', () => {
    describe('element', () => {
      it('changed element', () => {
        const diff = getSemanticDomDiff('<div></div>', '<span></span>');

        expect(diff.message).to.equal('tag <div> was changed to tag <span>');
        expect(diff.path).to.equal('div');
      });

      it('added element', () => {
        const diff = getSemanticDomDiff('<div></div>', '<div></div><div></div>');

        expect(diff.message).to.equal('tag <div> has been added');
        expect(diff.path).to.equal('');
      });

      it('removed element', () => {
        const diff = getSemanticDomDiff('<div></div><div></div>', '<div></div>');

        expect(diff.message).to.equal('tag <div> has been removed');
        expect(diff.path).to.equal('');
      });
    });

    describe('attributes', () => {
      it('changed attribute', () => {
        const diff = getSemanticDomDiff('<div foo="bar"></div>', '<div foo="baz"></div>');

        expect(diff.message).to.equal('attribute [foo="bar"] was changed to attribute [foo="baz"]');
        expect(diff.path).to.equal('div');
      });

      it('added attribute', () => {
        const diff = getSemanticDomDiff('<div></div>', '<div foo="bar"></div>');

        expect(diff.message).to.equal('attribute [foo="bar"] has been added');
        expect(diff.path).to.equal('div');
      });

      it('removed attribute', () => {
        const diff = getSemanticDomDiff('<div foo="bar"></div>', '<div></div>');

        expect(diff.message).to.equal('attribute [foo="bar"] has been removed');
        expect(diff.path).to.equal('div');
      });
    });

    describe('text', () => {
      it('changed text', () => {
        const diff = getSemanticDomDiff('<div>foo</div>', '<div>bar</div>');

        expect(diff.message).to.equal('text "foo" was changed to text "bar"');
        expect(diff.path).to.equal('div');
      });

      it('removed text', () => {
        const diff = getSemanticDomDiff('<div>foo</div>', '<div></div>');

        expect(diff.message).to.equal('text "foo" has been removed');
        expect(diff.path).to.equal('div');
      });

      it('added text', () => {
        const diff = getSemanticDomDiff('<div></div>', '<div>foo</div>');

        expect(diff.message).to.equal('text "foo" has been added');
        expect(diff.path).to.equal('div');
      });
    });

    describe('multiple diffs', () => {
      it('returns the first diff', () => {
        const diff = getSemanticDomDiff('<div>foo</div><div foo="bar"></div>', '<div>bar</div><span foo="baz"></span>');

        expect(diff.message).to.equal('tag <div> was changed to tag <span>');
        expect(diff.path).to.equal('div');
      });
    });

    describe('deep changes', () => {
      it('element changes', () => {
        const a = `
          <div>
            <div id="foo">
              <div>
                <div class="foo">
                  <div class="foo bar baz">
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        `;
        const b = `
          <div>
            <div id="foo">
              <div>
                <div class="foo">
                  <span class="foo bar baz">
                  </span>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        `;
        const diff = getSemanticDomDiff(a, b);

        expect(diff.message).to.equal('tag <div> was changed to tag <span>');
        expect(diff.path).to.equal('div > div#foo > div > div.foo > div.bar.baz.foo');
      });

      it('attribute changes', () => {
        const a = `
          <div>
            <div id="foo">
              <div>
                <div>
                  <div>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        `;
        const b = `
          <div>
            <div id="foo">
              <div>
                <div foo="bar">
                  <div>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        `;
        const diff = getSemanticDomDiff(a, b);

        expect(diff.message).to.equal('attribute [foo="bar"] has been added');
        expect(diff.path).to.equal('div > div#foo > div > div');
      });
    });
  });

  describe('equality', () => {
    describe('simple', () => {
      it('element', () => {
        const diff = getSemanticDomDiff('<div></div>', '<div></div>');

        expect(diff).to.equal(null);
      });

      it('attribute', () => {
        const diff = getSemanticDomDiff('<div foo="bar"></div>', '<div foo="bar"></div>');

        expect(diff).to.equal(null);
      });

      it('text', () => {
        const diff = getSemanticDomDiff('<div>foo</div>', '<div>foo</div>');

        expect(diff).to.equal(null);
      });
    });

    describe('complex', () => {
      it('large template', () => {
        const diff = getSemanticDomDiff(largeTemplate, largeTemplate);

        expect(diff).to.equal(null);
      });

      it('self closing tags', () => {
        const diff = getSemanticDomDiff('<div><br><hr /></div>', '<div><br /><hr></div>');

        expect(diff).to.equal(null);
      });
    });

    describe('ordering', () => {
      it('attributes order', () => {
        const diff = getSemanticDomDiff('<div a="1" b="2" c="3"></div>', '<div c="3" a="1" b="2"></div>');

        expect(diff).to.equal(null);
      });

      it('class order', () => {
        const diff = getSemanticDomDiff('<div class="foo bar"></div>', '<div class="bar foo"></div>');

        expect(diff).to.equal(null);
      });
    });

    describe('whitespace', () => {
      it('trailing whitespace in attributes', () => {
        const diff = getSemanticDomDiff('<div foo="bar" ></div>', '<div foo="bar"></div>');

        expect(diff).to.equal(null);
      });

      it('trailing whitespace in class', () => {
        const diff = getSemanticDomDiff('<div class="foo bar "></div>', '<div class="foo bar "></div>');

        expect(diff).to.equal(null);
      });

      it('whitespace between classes', () => {
        const diff = getSemanticDomDiff('<div class="foo  bar "></div>', '<div class="foo bar"></div>');

        expect(diff).to.equal(null);
      });

      it('whitespace before and after template', () => {
        const diff = getSemanticDomDiff(' <div></div> ', '<div></div>');

        expect(diff).to.equal(null);
      });

      it('whitespace in between nodes', () => {
        const diff = getSemanticDomDiff('<div> </div>    foo  <div>     </div>', '<div></div>foo<div></div>');

        expect(diff).to.equal(null);
      });

      it('whitespace around text nodes', () => {
        const diff = getSemanticDomDiff('<div>foo</div>', '<div> foo </div>');

        expect(diff).to.equal(null);
      });
    });

    describe('tabs', () => {
      it('tabs before and after template', () => {
        const diff = getSemanticDomDiff('\t\t<div></div>\t', '<div></div>');

        expect(diff).to.equal(null);
      });

      it('tabs in between nodes', () => {
        const diff = getSemanticDomDiff('<div>\t<div></div>\t \t \t</div>', '<div><div></div></div>');

        expect(diff).to.equal(null);
      });

      it('tabs around text nodes', () => {
        const diff = getSemanticDomDiff('<div>foo</div>', '<div>\tfoo\t</div>');

        expect(diff).to.equal(null);
      });
    });

    describe('newlines', () => {
      it('newlines before and after template', () => {
        const diff = getSemanticDomDiff('\n\n<div></div>\n', '<div></div>');

        expect(diff).to.equal(null);
      });

      it('newlines in between nodes', () => {
        const diff = getSemanticDomDiff('<div>\n<div></div>\n \n \n</div>', '<div><div></div></div>');

        expect(diff).to.equal(null);
      });

      it('newlines around text nodes', () => {
        const diff = getSemanticDomDiff('<div>foo</div>', '<div>\n\n\nfoo\n</div>');

        expect(diff).to.equal(null);
      });
    });

    describe('filtered nodes', () => {
      it('comments', () => {
        const diff = getSemanticDomDiff('<div>foo<!-- comment --></div>', '<div>foo</div>');

        expect(diff).to.equal(null);
      });

      it('styles', () => {
        const diff = getSemanticDomDiff('<div>foo<style> .foo { color: blue; } </style></div>', '<div>foo</div>');

        expect(diff).to.equal(null);
      });

      it('script', () => {
        const diff = getSemanticDomDiff('<div>foo<script>console.log("foo");</script></div>', '<div>foo</div>');

        expect(diff).to.equal(null);
      });

      it('ignored tags', () => {
        const diff = getSemanticDomDiff('<div><span>foo</span></div>', '<div><span>bar</span></div>', { ignoredTags: ['span'] });

        expect(diff).to.equal(null);
      });
    });


    describe('template string', () => {
      it('differently formatted', () => {
        const a = `
          <div>foo</div>
          <div>bar</div>
          <div></div>
        `;
        const b = `
        <div>foo</div>
<div>


bar
</div>
    <div></div>
      `;
        const diff = getSemanticDomDiff(a, b);

        expect(diff).to.equal(null);
      });
    });
  });

  describe('values', () => {
    it('handles strings', () => {
      const diff = getSemanticDomDiff('<div></div>', '<span></span>');

      expect(diff.message).to.equal('tag <div> was changed to tag <span>');
    });
  });

  describe('diff tree', () => {
    it('returns the left and right side normalized trees', () => {
      const diff = getSemanticDomDiff(`
        <div id="foo">  <div>  <div class="foo   bar  ">    <div>
        </div>   </div>
      `, '<span></span>');

      expect(diff.normalizedLeftHTML).to.equal('<div id="foo"><div><div class="bar foo"><div></div></div></div></div>');
      expect(diff.normalizedRightHTML).to.equal('<span></span>');
    });
  });
});
