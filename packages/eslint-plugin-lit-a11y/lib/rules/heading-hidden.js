/**
 * @fileoverview Headings must not be hidden from screenreaders
 * @author open-wc
 */

const ruleExtender = require('eslint-rule-extender');
const { TemplateAnalyzer } = require('eslint-plugin-lit/lib/template-analyzer.js');
const { isHiddenFromScreenReader } = require('../utils/isHiddenFromScreenReader.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { HasLitHtmlImportRuleExtension } = require('../utils/HasLitHtmlImportRuleExtension.js');
const { getContextSourceCode } = require('../utils/getContextSourceCode.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/** @type {import("eslint").Rule.RuleModule} */
const HeadingHiddenRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Headings must not be hidden from screenreaders.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/heading-hidden.md',
    },
    messages: {
      hidden: 'Headings must not be hidden from screenreaders.',
    },
    fixable: null,
    schema: [
      {
        customHeadingElements: {
          type: 'array',
          description: 'list of custom elements tag names which should be considered headings',
          default: [],
          uniqueItems: true,
          additionalItems: false,
          items: {
            type: 'string',
            pattern: '^[a-z]\\w+-\\w+',
          },
        },
      },
    ],
  },
  create(context) {
    function isRelevantElement(element, relevantElements = []) {
      return relevantElements.includes(element.name);
    }

    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);
          const options = (context.options && context.options[0]) || {};

          analyzer.traverse({
            enterElement(element) {
              if (!element.sourceCodeLocation) {
                return; // probably a tree correction node
              }

              if (
                isRelevantElement(element, [
                  ...HEADINGS,
                  ...(options.customHeadingElements || []),
                ]) &&
                isHiddenFromScreenReader(element)
              ) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;

                if (loc) {
                  context.report({ loc, messageId: 'hidden' });
                }
              }
            },
          });
        }
      },
    };
  },
};

module.exports = ruleExtender(HeadingHiddenRule, HasLitHtmlImportRuleExtension);
