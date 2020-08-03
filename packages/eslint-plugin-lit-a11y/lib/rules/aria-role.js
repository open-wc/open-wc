/**
 * @fileoverview aria-role
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const validAriaRoles = [
  'alert',
  'application',
  'article',
  'banner',
  'button',
  'cell',
  'checkbox',
  'comment',
  'complementary',
  'contentinfo',
  'dialog',
  'document',
  'feed',
  'figure',
  'form',
  'grid',
  'gridcell',
  'heading',
  'img',
  'list',
  'listbox',
  'listitem',
  'main',
  'mark',
  'navigation',
  'region',
  'row',
  'rowgroup',
  'search',
  'suggestion',
  'switch',
  'tab',
  'table',
  'tabpanel',
  'textbox',
  'timer',
];

module.exports = {
  meta: {
    docs: {
      description: 'aria-role',
      category: 'Fill me in',
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      TaggedTemplateExpression: node => {
        if (
          node.type === 'TaggedTemplateExpression' &&
          node.tag.type === 'Identifier' &&
          node.tag.name === 'html'
        ) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement: element => {
              // eslint-disable-next-line
              for (const attr in element.attribs) {
                if (attr === 'role') {
                  if (!validAriaRoles.includes(element.attribs[attr])) {
                    if (!element.attribs[attr].startsWith('{{')) {
                      const loc = analyzer.getLocationForAttribute(element, attr);
                      context.report({
                        loc,
                        message: 'Invalid role',
                      });
                    }
                  }
                }
              }
            },
          });
        }
      },
    };
  },
};
