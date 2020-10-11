/**
 * @fileoverview
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const unsupportedElements = ['meta', 'script', 'style'];

/** @type {import("eslint").Rule.RuleModule} */
const AriaUnsupportedElementsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Certain reserved DOM elements do not support ARIA roles, states and properties. ',
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
              if (unsupportedElements.includes(element.name)) {
                for (const attr of Object.keys(element.attribs)) {
                  if (attr.startsWith('aria-') || attr === 'role') {
                    const loc = analyzer.getLocationForAttribute(element, attr);
                    context.report({
                      loc,
                      message:
                        'Certain reserved DOM elements do not support ARIA roles, states, or properties.',
                    });
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

module.exports = AriaUnsupportedElementsRule;
