/**
 * @fileoverview Enforce tabIndex value is not greater than zero.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce tabIndex value is not greater than zero.',
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
              if (Object.keys(element.attribs).includes('tabindex')) {
                const value = Number(element.attribs.tabindex);

                // eslint-disable-next-line
                if (isNaN(value)) {
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
