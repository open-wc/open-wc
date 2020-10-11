/**
 * @fileoverview Enforce usage of onBlur over onChange for accessibility.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const applicableTypes = ['select', 'option'];

/** @type {import("eslint").Rule.RuleModule} */
const NoOnchangeRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce usage of @blur over @change for accessibility.',
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
              if (applicableTypes.includes(element.name)) {
                const change = Object.keys(element.attribs).includes('@change');
                const blur = Object.keys(element.attribs).includes('@blur');

                if (change && !blur) {
                  const loc = analyzer.getLocationFor(element);
                  context.report({
                    loc,
                    message:
                      '@blur must be used instead of @change, unless absolutely necessary and it causes no negative consequences for keyboard only or screen reader users.',
                  });
                }
              }
            },
          });
        }
      },
    };
  },
};

module.exports = NoOnchangeRule;
