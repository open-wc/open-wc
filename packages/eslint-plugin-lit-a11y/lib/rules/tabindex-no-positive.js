/**
 * @fileoverview Enforce tabIndex value is not greater than zero.
 * @author open-wc
 */
const ruleExtender = require('eslint-rule-extender');
const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { HasLitHtmlImportRuleExtension } = require('../utils/HasLitHtmlImportRuleExtension.js');
const { isExpressionPlaceholder, isLiteral } = require('../../template-analyzer/util.js');

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
      tabindexNoPositive: 'Invalid tabindex value {{value}}.',
      avoidPositiveTabindex: 'Avoid positive tabindex.',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const tabIndexAttributes = ['tabindex', '.tabindex'];

    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              const attribs = Object.keys(element.attribs);
              tabIndexAttributes.forEach(tabIndexAttribute => {
                if (!attribs.includes(tabIndexAttribute))
                  return;

                let literal = element.attribs[tabIndexAttribute];

                if (isExpressionPlaceholder(literal)) {
                  const expr = analyzer.getExpressionFromPlaceholder(literal);

                  // if the interpolated value a simple literal expression, we can analyze it
                  if (isLiteral(expr)) literal = `${expr.value}`;
                  // if the interpolated value is a variable name or some other
                  // non-literal expression, we can't analyze it
                  else return;
                }

                const value = parseInt(literal, 10);

                if (Number.isNaN(value)) {
                  const loc = analyzer.getLocationForAttribute(element, tabIndexAttribute);
                  context.report({
                    loc,
                    messageId: 'tabindexNoPositive',
                    data: { value: literal.toString() },
                  });
                  return;
                }

                if (value > 0) {
                  const loc = analyzer.getLocationForAttribute(element, tabIndexAttribute);
                  context.report({ loc, messageId: 'avoidPositiveTabindex' });
                }
              });
            },
          });
        }
      },
    };
  },
};

module.exports = ruleExtender(TabindexNoPositiveRule, HasLitHtmlImportRuleExtension);
