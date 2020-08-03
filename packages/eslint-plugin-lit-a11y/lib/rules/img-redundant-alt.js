/**
 * @fileoverview
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

let keywords = ['image', 'picture', 'photo'];

module.exports = {
  meta: {
    docs: {
      description: 'Enforce img alt attribute does not contain the word image, picture, or photo.',
      category: 'Fill me in',
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        keywords: {
          type: 'array',
          items: {
            type: 'string',
          },
          uniqueItems: true,
          additionalItems: false,
        },
      },
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
              if (element.name === 'img') {
                if ('alt' in element.attribs && !('aria-hidden' in element.attribs)) {
                  if (context.options && context.options[0] && context.options[0].keywords) {
                    keywords = keywords.concat(context.options[0].keywords);
                  }
                  keywords.forEach(keyword => {
                    if (element.attribs.alt.toLowerCase().includes(keyword)) {
                      const loc = analyzer.getLocationForAttribute(element, 'alt');
                      context.report({
                        loc,
                        message:
                          'Enforce img alt attribute does not contain the word image, picture, or photo.',
                      });
                    }
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
