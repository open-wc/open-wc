import { expect } from '@bundled-es-modules/chai';
import { getDiffableSemanticHTML } from '../index.js';
import largeTemplate from './large-template';

describe('getSemanticDomDiff()', () => {
  describe('diffs', () => {
    describe('element', () => {
      it('changed element', () => {
        const htmlA = getDiffableSemanticHTML('<div></div>');
        const htmlB = getDiffableSemanticHTML('<span></span>');

        expect(htmlA).to.not.equal(htmlB);
      });

      it('added element', () => {
        const htmlA = getDiffableSemanticHTML('<div></div>');
        const htmlB = getDiffableSemanticHTML('<div></div><div></div>');

        expect(htmlA).to.not.equal(htmlB);
      });

      it('removed element', () => {
        const htmlA = getDiffableSemanticHTML('<div></div><div></div>');
        const htmlB = getDiffableSemanticHTML('<div></div>');

        expect(htmlA).to.not.equal(htmlB);
      });
    });

    describe('attributes', () => {
      it('changed attribute', () => {
        const htmlA = getDiffableSemanticHTML('<div foo="bar"></div>');
        const htmlB = getDiffableSemanticHTML('<div foo="baz"></div>');

        expect(htmlA).to.not.equal(htmlB);
      });

      it('added attribute', () => {
        const htmlA = getDiffableSemanticHTML('<div></div>');
        const htmlB = getDiffableSemanticHTML('<div foo="bar"></div>');

        expect(htmlA).to.not.equal(htmlB);
      });

      it('removed attribute', () => {
        const htmlA = getDiffableSemanticHTML('<div foo="bar"></div>');
        const htmlB = getDiffableSemanticHTML('<div></div>');

        expect(htmlA).to.not.equal(htmlB);
      });
    });

    describe('text', () => {
      it('changed text', () => {
        const htmlA = getDiffableSemanticHTML('<div>foo</div>');
        const htmlB = getDiffableSemanticHTML('<div>bar</div>');

        expect(htmlA).to.not.equal(htmlB);
      });

      it('removed text', () => {
        const htmlA = getDiffableSemanticHTML('<div>foo</div>');
        const htmlB = getDiffableSemanticHTML('<div></div>');

        expect(htmlA).to.not.equal(htmlB);
      });

      it('added text', () => {
        const htmlA = getDiffableSemanticHTML('<div></div>');
        const htmlB = getDiffableSemanticHTML('<div>foo</div>');

        expect(htmlA).to.not.equal(htmlB);
      });
    });

    describe('deep changes', () => {
      it('element changes', () => {
        const htmlA = getDiffableSemanticHTML(`
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
        `);

        const htmlB = getDiffableSemanticHTML(`
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
        `);

        expect(htmlA).to.not.equal(htmlB);
      });

      it('attribute changes', () => {
        const htmlA = getDiffableSemanticHTML(`
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
        `);

        const htmlB = getDiffableSemanticHTML(`
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
        `);

        expect(htmlA).to.not.equal(htmlB);
      });
    });
  });

  describe('equality', () => {
    describe('simple', () => {
      it('element', () => {
        const htmlA = getDiffableSemanticHTML('<div></div>');
        const htmlB = getDiffableSemanticHTML('<div></div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('attribute', () => {
        const htmlA = getDiffableSemanticHTML('<div foo="bar"></div>');
        const htmlB = getDiffableSemanticHTML('<div foo="bar"></div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('text', () => {
        const htmlA = getDiffableSemanticHTML('<div>foo</div>');
        const htmlB = getDiffableSemanticHTML('<div>foo</div>');
        expect(htmlA).to.equal(htmlB);
      });
    });

    describe('complex', () => {
      it('large template', () => {
        const htmlA = getDiffableSemanticHTML(largeTemplate);
        const htmlB = getDiffableSemanticHTML(largeTemplate);
        expect(htmlA).to.equal(htmlB);
      });
    });

    describe('ordering', () => {
      it('attributes order', () => {
        const htmlA = getDiffableSemanticHTML('<div a="1" b="2" c="3"></div>');
        const htmlB = getDiffableSemanticHTML('<div c="3" a="1" b="2"></div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('class order', () => {
        const htmlA = getDiffableSemanticHTML('<div class="foo bar"></div>');
        const htmlB = getDiffableSemanticHTML('<div class="bar foo"></div>');
        expect(htmlA).to.equal(htmlB);
      });
    });

    describe('whitespace', () => {
      it('trailing whitespace in attributes', () => {
        const htmlA = getDiffableSemanticHTML('<div foo="bar" ></div>');
        const htmlB = getDiffableSemanticHTML('<div foo="bar"></div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('trailing whitespace in class', () => {
        const htmlA = getDiffableSemanticHTML('<div class="foo bar "></div>');
        const htmlB = getDiffableSemanticHTML('<div class="foo bar "></div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('whitespace between classes', () => {
        const htmlA = getDiffableSemanticHTML('<div class="foo  bar "></div>');
        const htmlB = getDiffableSemanticHTML('<div class="foo bar"></div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('whitespace before and after template', () => {
        const htmlA = getDiffableSemanticHTML(' <div></div> ');
        const htmlB = getDiffableSemanticHTML('<div></div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('whitespace in between nodes', () => {
        const htmlA = getDiffableSemanticHTML('<div> </div>    foo  <div>     </div>');
        const htmlB = getDiffableSemanticHTML('<div></div>foo<div></div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('whitespace around text nodes', () => {
        const htmlA = getDiffableSemanticHTML('<div>foo</div>');
        const htmlB = getDiffableSemanticHTML('<div> foo </div>');
        expect(htmlA).to.equal(htmlB);
      });
    });

    describe('tabs', () => {
      it('tabs before and after template', () => {
        const htmlA = getDiffableSemanticHTML('\t\t<div></div>\t');
        const htmlB = getDiffableSemanticHTML('<div></div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('tabs in between nodes', () => {
        const htmlA = getDiffableSemanticHTML('<div>\t<div></div>\t \t \t</div>');
        const htmlB = getDiffableSemanticHTML('<div><div></div></div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('tabs around text nodes', () => {
        const htmlA = getDiffableSemanticHTML('<div>foo</div>');
        const htmlB = getDiffableSemanticHTML('<div>\tfoo\t</div>');
        expect(htmlA).to.equal(htmlB);
      });
    });

    describe('newlines', () => {
      it('newlines before and after template', () => {
        const htmlA = getDiffableSemanticHTML('\n\n<div></div>\n');
        const htmlB = getDiffableSemanticHTML('<div></div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('newlines in between nodes', () => {
        const htmlA = getDiffableSemanticHTML('<div>\n<div></div>\n \n \n</div>');
        const htmlB = getDiffableSemanticHTML('<div><div></div></div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('newlines around text nodes', () => {
        const htmlA = getDiffableSemanticHTML('<div>foo</div>');
        const htmlB = getDiffableSemanticHTML('<div>\n\n\nfoo\n</div>');
        expect(htmlA).to.equal(htmlB);
      });
    });

    describe('filtered nodes', () => {
      it('comments', () => {
        const htmlA = getDiffableSemanticHTML('<div>foo<!-- comment --></div>');
        const htmlB = getDiffableSemanticHTML('<div>foo</div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('styles', () => {
        const htmlA = getDiffableSemanticHTML(
          '<div>foo<style> .foo { color: blue; } </style></div>',
        );
        const htmlB = getDiffableSemanticHTML('<div>foo</div>');
        expect(htmlA).to.equal(htmlB);
      });

      it('script', () => {
        const htmlA = getDiffableSemanticHTML('<div>foo<script>console.log("foo");</script></div>');
        const htmlB = getDiffableSemanticHTML('<div>foo</div>');
        expect(htmlA).to.equal(htmlB);
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
        const htmlA = getDiffableSemanticHTML(a);
        const htmlB = getDiffableSemanticHTML(b);
        expect(htmlA).to.equal(htmlB);
      });
    });
  });
});
