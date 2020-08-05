/**
 * @fileoverview Enforce distracting elements are not used.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const distractingElements = ['blink', 'marquee'];

module.exports = {
  meta: {
    docs: {
      description: 'Enforce distracting elements are not used.',
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
              if (distractingElements.includes(element.name)) {
                const loc = analyzer.getLocationFor(element);
                context.report({
                  loc,
                  message: "Don't use distracting elements.",
                });
              }
            },
          });
        }
      },
    };
  },
};
