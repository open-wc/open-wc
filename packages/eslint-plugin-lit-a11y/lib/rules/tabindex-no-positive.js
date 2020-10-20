/**
 * @fileoverview Enforce tabIndex value is not greater than zero.
 * @author open-wc
 */
const ruleExtender = require('eslint-rule-extender');
const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { getExpressionValue } = require('../utils/getExpressionValue.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { HasLitHtmlImportRuleExtension } = require('../utils/HasLitHtmlImportRuleExtension.js');

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
      url:
        'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/tabindex-no-positive.md',
    },
    messages: {
      tabindexNoPositive: 'Invalid tabindex value {{val}}.',
      avoidPositiveTabindex: 'Avoid positive tabindex.',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (Object.keys(element.attribs).includes('tabindex')) {
                const attributeValue = element.attribs.tabindex;
                const val = getExpressionValue(analyzer, attributeValue);

                if (!val && attributeValue.startsWith('{{')) return;

                const value = Number(val || attributeValue);

                if (Number.isNaN(value)) {
                  const loc = analyzer.getLocationForAttribute(element, 'tabindex');
                  context.report({
                    loc,
                    messageId: 'tabindexNoPositive',
                    data: { val: val || attributeValue },
                  });
                  return;
                }

                if (value > 0) {
                  const loc = analyzer.getLocationForAttribute(element, 'tabindex');
                  context.report({ loc, messageId: 'avoidPositiveTabindex' });
                }
              }
            },
          });
        }
      },
    };
  },
};

module.exports = ruleExtender(TabindexNoPositiveRule, HasLitHtmlImportRuleExtension);
