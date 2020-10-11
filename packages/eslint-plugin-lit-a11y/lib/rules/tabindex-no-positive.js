/**
 * @fileoverview Enforce tabIndex value is not greater than zero.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { getAttrVal } = require('../utils/getAttrVal.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const TabindexNoPositiveRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce tabIndex value is not greater than zero.',
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
              if (Object.keys(element.attribs).includes('tabindex')) {
                const val = getAttrVal(element.attribs.tabindex);
                if (val && val.startsWith('{{')) return;

                const value = Number(val);

                if (Number.isNaN(value)) {
                  const loc = analyzer.getLocationForAttribute(element, 'tabindex');
                  context.report({
                    loc,
                    message: `Invalid tabindex value.`,
                  });
                  return;
                }

                if (value > 0) {
                  const loc = analyzer.getLocationForAttribute(element, 'tabindex');
                  context.report({
                    loc,
                    message: `Avoid positive tabindex.`,
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

module.exports = TabindexNoPositiveRule;
