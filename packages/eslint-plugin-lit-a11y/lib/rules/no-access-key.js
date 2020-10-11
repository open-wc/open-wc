/**
 * @fileoverview Enforce no accesskey attribute on element.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const NoAccessKeyRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce no accesskey attribute on element.',
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
              if (Object.keys(element.attribs).includes('accesskey')) {
                const loc = analyzer.getLocationForAttribute(element, 'accesskey');
                context.report({
                  loc,
                  message: `Avoid using the accesskey attribute.`,
                });
              }
            },
          });
        }
      },
    };
  },
};

module.exports = NoAccessKeyRule;
