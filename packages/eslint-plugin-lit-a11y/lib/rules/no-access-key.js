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
