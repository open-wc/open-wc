/**
 * @fileoverview Ensures the document has a valid `lang` attribute.
 * @author open-wc
 */

const ruleExtender = require('eslint-rule-extender');
const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer');
const { elementHasAttribute } = require('../utils/elementHasAttribute');
const { HasLitHtmlImportRuleExtension } = require('../utils/HasLitHtmlImportRuleExtension');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate');

// where do I store the valid values? in a text file?
// two tests. has a lang attribute
// the lang attribute is valid

const ValidLangRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensures the document has a valid `lang` attribute.',
      category: 'Accessibility',
      recommended: false,
      url:
        'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/tabindex-no-positive.md',
    },
    messages: {
      noLangPresent: 'No lang attribute is present.',
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
              if (!elementHasAttribute(element, 'lang')) {
                const loc = analyzer.getLocationFor(element);
                context.report({
                  loc,
                  messageId: 'noLangPresent',
                });
              }

              // add check to see if current value is a valid one
            },
          });
        }
      },
    };
  },
};

module.exports = ruleExtender(ValidLangRule, HasLitHtmlImportRuleExtension);
