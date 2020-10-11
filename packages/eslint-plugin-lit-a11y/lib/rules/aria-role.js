/**
 * @fileoverview aria-role
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

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

/** @type {import("eslint").Rule.RuleModule} */
const AriaRoleRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'aria-role',
      category: 'Accessibility',
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
        if (isHtmlTaggedTemplate(node)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement: element => {
              for (const [attr, value] of Object.entries(element.attribs)) {
                if (attr === 'role') {
                  if (!validAriaRoles.includes(value)) {
                    if (!value.startsWith('{{')) {
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

module.exports = AriaRoleRule;
