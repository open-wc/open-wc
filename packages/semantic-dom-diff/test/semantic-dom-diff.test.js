import { expect } from '@bundled-es-modules/chai';
import getDiffableSemanticHTML from '../src/get-diffable-html';
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

      it('multiline element', () => {
        const htmlA = getDiffableSemanticHTML(`
          <my-element
            foo="bar"
            buz="baz"
          ></my-element>
        `);
        const htmlB = getDiffableSemanticHTML('<my-element foo="bar" buz="baz"></my-element>');
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

    it('can handle regular html documents', () => {
      const document = `
        <!doctype html>
        <html lang="en-GB">
          <head>
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>test</title>
          </head>
          <body></body>
        </html>
      `;
      expect(getDiffableSemanticHTML(document)).to.be.a('string');
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

      it('ignored tags', () => {
        const htmlA = getDiffableSemanticHTML(
          `
          <div>
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
        const htmlB = getDiffableSemanticHTML(`
          <div>
            <div>A</div>
            <div>G</div>
          </div>
        `);
        expect(htmlA).to.equal(htmlB);
      });

      it('ignored attributes', () => {
        const htmlA = getDiffableSemanticHTML(
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
        const htmlB = getDiffableSemanticHTML(`
          <div>
            <div class="foo">A</div>
            <span bar="foo">
              <div>B</div>
              <div>E</div>
            </span>
            <div>F</div>
          </div>
        `);
        expect(htmlA).to.equal(htmlB);
      });

      it('ignored attributes for tags', () => {
        const diffOptions = {
          ignoreAttributes: [{ tags: ['my-element', 'div'], attributes: ['foo', 'foo2'] }],
        };
        const htmlA = getDiffableSemanticHTML(
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
          diffOptions,
        );
        const htmlB = getDiffableSemanticHTML(
          `
          <div>
            <div class="foo">A</div>
            <my-element></my-element>
            <span foo="bar" bar="foo">
              <div bar="foo">B</div>
              <div>E</div>
            </span>
            <div>F</div>
          </div>
        `,
          diffOptions,
        );
        expect(htmlA).to.equal(htmlB);
      });

      it('throws on invalid options', () => {
        try {
          getDiffableSemanticHTML(`<div foo="bar"></div>`, {
            ignoreAttributes: [{ tags: ['div'] }],
          });
          throw new Error('should not resolve');
        } catch (error) {
          expect(error.message).to.equal(
            "An object entry to ignoreAttributes should contain a 'tags' and an 'attributes' property.",
          );
        }
      });

      describe('ignored light dom', () => {
        it('no light dom', () => {
          const diffOptions = {
            ignoreLightDom: ['my-element'],
          };
          const htmlA = getDiffableSemanticHTML(
            `
            <my-element foo="bar" foo2="bar"></my-element>
          `,
            diffOptions,
          );
          const htmlB = getDiffableSemanticHTML(
            `
            <my-element foo="bar" foo2="bar"></my-element>
          `,
            diffOptions,
          );
          expect(htmlA).to.equal(htmlB);
        });
      });

      it('light dom text', () => {
        const diffOptions = {
          ignoreLightDom: ['my-element'],
        };
        const htmlA = getDiffableSemanticHTML(
          `
          <my-element foo="bar" foo2="bar">
            light dom
          </my-element>
        `,
          diffOptions,
        );
        const htmlB = getDiffableSemanticHTML(
          `
          <my-element foo="bar" foo2="bar">
          </my-element>
        `,
          diffOptions,
        );
        expect(htmlA).to.equal(htmlB);
      });

      it('two light dom text nodes', () => {
        const diffOptions = {
          ignoreLightDom: ['my-element'],
        };
        const htmlA = getDiffableSemanticHTML(
          `
          <my-element foo="bar" foo2="bar">
            light dom 1
            <!-- comment to create a second text node -->
            light dom 2
          </my-element>
        `,
          diffOptions,
        );
        const htmlB = getDiffableSemanticHTML(
          `
          <my-element foo="bar" foo2="bar"></my-element>
        `,
          diffOptions,
        );
        expect(htmlA).to.equal(htmlB);
      });

      it('light dom node', () => {
        const diffOptions = {
          ignoreLightDom: ['my-element'],
        };
        const htmlA = getDiffableSemanticHTML(
          `
          <my-element foo="bar" foo2="bar">
            <div>light dom</div>
          </my-element>
        `,
          diffOptions,
        );
        const htmlB = getDiffableSemanticHTML(
          `
          <my-element foo="bar" foo2="bar"></my-element>
        `,
          diffOptions,
        );
        expect(htmlA).to.equal(htmlB);
      });

      it('two light dom nodes', () => {
        const diffOptions = {
          ignoreLightDom: ['my-element'],
        };
        const htmlA = getDiffableSemanticHTML(
          `
          <my-element foo="bar" foo2="bar">
            <div>light dom 1</div>
            <div>light dom 2</div>
          </my-element>
        `,
          diffOptions,
        );
        const htmlB = getDiffableSemanticHTML(
          `
          <my-element foo="bar" foo2="bar"></my-element>
        `,
          diffOptions,
        );
        expect(htmlA).to.equal(htmlB);
      });

      it('attributes on light dom nodes', () => {
        const diffOptions = {
          ignoreLightDom: ['my-element'],
        };
        const htmlA = getDiffableSemanticHTML(
          `
          <my-element foo="bar" foo2="bar">
            <div id="foo" class="bar"></div>
            <div class="foo2" id="foo2">
              <div class="foo3" id="foo3"></div>
            </div>
          </my-element>
        `,
          diffOptions,
        );
        const htmlB = getDiffableSemanticHTML(
          `
          <my-element foo="bar" foo2="bar"></my-element>
        `,
          diffOptions,
        );
        expect(htmlA).to.equal(htmlB);
      });

      it('nested light dom', () => {
        const diffOptions = {
          ignoreLightDom: ['my-element-1', 'my-element-2'],
        };
        const htmlA = getDiffableSemanticHTML(
          `
          <my-element-1 foo="bar" foo2="bar">
            <my-element-1>
              <div>light dom< 1/div>
            </my-element-1>

            <div>light dom 2</div>

            <my-element-2>
              <my-element-1>light dom 3</my-element-1>
            </my-element-2>

          </my-element-1>
        `,
          diffOptions,
        );
        const htmlB = getDiffableSemanticHTML(
          `
          <my-element-1 foo="bar" foo2="bar"></my-element-1>
        `,
          diffOptions,
        );
        expect(htmlA).to.equal(htmlB);
      });

      it('light dom ignored in a deep tree', () => {
        const diffOptions = {
          ignoreLightDom: ['my-element-1', 'my-element-2'],
        };
        const htmlA = getDiffableSemanticHTML(
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
          diffOptions,
        );
        const htmlB = getDiffableSemanticHTML(
          `
          <div>
            <div class="foo">
              <div>
                <my-element-1 foo="bar"></my-element-1>
                <my-element-1 id="x"><div></div></my-element-1>
              </div>

              <my-element-2 class="foo bar"></my-element-2>
            </div>

            <div>
              <div>
                <my-element-1 hidden></my-element-1>
              </div>
            </div>
          </div>

        `,
          diffOptions,
        );
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
