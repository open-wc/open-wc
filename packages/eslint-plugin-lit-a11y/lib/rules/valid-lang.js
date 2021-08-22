/**
 * @fileoverview Ensures the document has a valid `lang` attribute.
 * @author open-wc
 */

const ruleExtender = require('eslint-rule-extender');
const { HasLitHtmlImportRuleExtension } = require('../utils/HasLitHtmlImportRuleExtension');

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

  create() {
    return {
      'Literal, TemplateElement': node => {
        const { type } = node;

        if (type === 'Literal') {
          // matches <html, and doesn't have lang between the closing >
        }
      },
    };
  },
};

module.exports = ruleExtender(ValidLangRule, HasLitHtmlImportRuleExtension);
