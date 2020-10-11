/**
 * @fileoverview
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const UNSUPPORTED_ELEMENTS = ['meta', 'script', 'style'];

/** @type {import("eslint").Rule.RuleModule} */
const AriaUnsupportedElementsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Certain reserved DOM elements do not support ARIA roles, states and properties.',
      category: 'Accessibility',
      recommended: false,
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (UNSUPPORTED_ELEMENTS.includes(element.name)) {
                for (const attr of Object.keys(element.attribs)) {
                  if (attr.startsWith('aria-') || attr === 'role') {
                    const loc = analyzer.getLocationForAttribute(element, attr);
                    context.report({
                      loc,
                      message: `<{{tagName}}> element does not support ARIA roles, states, or properties.`,
                      data: {
                        tagName: element.name,
                      },
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

module.exports = AriaUnsupportedElementsRule;
