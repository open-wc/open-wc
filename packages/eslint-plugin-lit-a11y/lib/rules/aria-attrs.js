/**
 * @fileoverview Elements cannot use an invalid ARIA attribute.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isAriaPropertyName } = require('../utils/aria.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const AriaAttrsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Elements cannot use an invalid ARIA attribute.',
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
            enterElement(element) {
              for (const attr of Object.keys(element.attribs)) {
                if (attr.startsWith('aria-')) {
                  if (!isAriaPropertyName(attr)) {
                    const loc = analyzer.getLocationForAttribute(element, attr);
                    context.report({
                      loc,
                      message: 'Elements cannot use an invalid ARIA attribute.',
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

module.exports = AriaAttrsRule;
