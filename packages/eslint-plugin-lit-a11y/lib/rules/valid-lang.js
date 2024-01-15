/**
 * @fileoverview Ensures the document has a valid `lang` attribute.
 * @author open-wc
 */

const ruleExtender = require('eslint-rule-extender');
const tags = require('language-tags');
const { TemplateAnalyzer } = require('eslint-plugin-lit/lib/template-analyzer');
const { getLiteralAttributeValue } = require('../utils/getLiteralAttributeValue.js');
const { HasLitHtmlImportRuleExtension } = require('../utils/HasLitHtmlImportRuleExtension.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { getContextSourceCode } = require('../utils/getContextSourceCode.js');

const ValidLangRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensures the document has a valid `lang` attribute.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/valid-html.md',
    },
    messages: {
      noLangPresent: 'No lang attribute is present.',
      invalidLang: 'The value passed through to lang is not BCP 47 compliant.',
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
              if (element.name === 'html') {
                const lang = getLiteralAttributeValue(
                  analyzer,
                  element,
                  'lang',
                  getContextSourceCode(context),
                );

                if (!lang) {
                  const loc = analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  );

                  return context.report({
                    loc,
                    messageId: 'noLangPresent',
                  });
                }

                // We cast this as string, as lang could be a number, since getLiteralAttributeValue returns a primitive, this would throw an error as `language-tags` performs string methods on the argument
                if (!tags.check(`${lang}`)) {
                  const loc =
                    analyzer.getLocationForAttribute(
                      element,
                      'lang',
                      getContextSourceCode(context),
                    ) ?? node.loc;

                  return context.report({
                    loc,
                    messageId: 'invalidLang',
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

module.exports = ruleExtender(ValidLangRule, HasLitHtmlImportRuleExtension);
