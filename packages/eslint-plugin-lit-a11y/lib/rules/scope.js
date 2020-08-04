/**
 * @fileoverview Enforce scope prop is only used on <th> elements.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce scope prop is only used on <th> elements.',
      category: 'Fill me in',
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },
  // eslint-disable-next-line
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
              if (element.name !== 'th' && Object.keys(element.attribs).includes('scope')) {
                const loc = analyzer.getLocationForAttribute(element, 'scope');
                context.report({
                  loc,
                  message: 'The scope prop can only be used on <th> elements.',
                });
              }
            },
          });
        }
      },
    };
  },
};
