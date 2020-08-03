/**
 * @fileoverview
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const unsupportedElements = ['meta', 'script', 'style'];

module.exports = {
  meta: {
    docs: {
      description:
        'Certain reserved DOM elements do not support ARIA roles, states and properties. ',
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
              if (unsupportedElements.includes(element.name)) {
                // eslint-disable-next-line
                for (const attr in element.attribs) {
                  if (attr.startsWith('aria-') || attr === 'role') {
                    const loc = analyzer.getLocationForAttribute(element, attr);
                    context.report({
                      loc,
                      message:
                        'Certain reserved DOM elements do not support ARIA roles, states and properties.',
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
