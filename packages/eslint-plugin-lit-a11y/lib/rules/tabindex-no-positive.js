/**
 * @fileoverview Enforce tabIndex value is not greater than zero.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { getExpressionValue } = require('../utils/getExpressionValue.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { hasLitHtmlImport, createValidLitHtmlSources } = require('../utils/utils.js');

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
    let isLitHtml = false;
    const validLitHtmlSources = createValidLitHtmlSources(context);

    const tabIndexAttributes = ['tabindex', '.tabindex'];

    return {
      ImportDeclaration(node) {
        if (hasLitHtmlImport(node, validLitHtmlSources)) {
          isLitHtml = true;
        }
      },
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node) && isLitHtml) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              const attribs = Object.keys(element.attribs);
              tabIndexAttributes.forEach(tabIndexAttribute => {
                if (!attribs.includes(tabIndexAttribute)) {
                  return;
                }
                const attributeValue = element.attribs[tabIndexAttribute];
                const val = getExpressionValue(analyzer, attributeValue);

                if (!val && attributeValue.startsWith('{{')) return;

                const value = Number(val || attributeValue);

                if (Number.isNaN(value)) {
                  const loc = analyzer.getLocationForAttribute(element, tabIndexAttribute);
                  context.report({
                    loc,
                    messageId: 'tabindexNoPositive',
                    data: { val: val || attributeValue },
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

module.exports = TabindexNoPositiveRule;
