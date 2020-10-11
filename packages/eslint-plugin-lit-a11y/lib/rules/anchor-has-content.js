/**
 * @fileoverview Enforce anchor elements to contain accessible content.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { hasAccessibleChildren } = require('../utils/hasAccessibleChildren.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
const AnchorHasContentRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce anchor elements to contain accessible content.',
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
              if (element.name === 'a') {
                if (!hasAccessibleChildren(element)) {
                  const loc = analyzer.getLocationFor(element);
                  context.report({
                    loc,
                    message: 'Anchor should contain accessible content.',
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

module.exports = AnchorHasContentRule;
