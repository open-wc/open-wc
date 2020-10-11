/**
 * @fileoverview
 * @author open-wc
 */

const { getAttrVal } = require('../utils/getAttrVal.js');
const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

let keywords = ['image', 'picture', 'photo'];

/** @type {import("eslint").Rule.RuleModule} */
const ImgRedundantAltRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce img alt attribute does not contain the word image, picture, or photo.',
      category: 'Accessibility',
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
        if (isHtmlTaggedTemplate(node)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement: element => {
              if (element.name === 'img') {
                if ('alt' in element.attribs && !('aria-hidden' in element.attribs)) {
                  if (context.options && context.options[0] && context.options[0].keywords) {
                    keywords = keywords.concat(context.options[0].keywords);
                  }
                  keywords.forEach(keyword => {
                    if (getAttrVal(element.attribs.alt).toLowerCase().includes(keyword)) {
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

module.exports = ImgRedundantAltRule;
