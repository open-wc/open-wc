/**
 * @fileoverview Ensure that slots do not have aria or role attributes.
 * @author Cory LaViska
 */

const ruleExtender = require('eslint-rule-extender');
const { TemplateAnalyzer } = require('eslint-plugin-lit/lib/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { HasLitHtmlImportRuleExtension } = require('../utils/HasLitHtmlImportRuleExtension.js');
const { getContextSourceCode } = require('../utils/getContextSourceCode.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const NoAriaSlot = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Slots do not allow aria or role attributes.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/no-aria-slot.md',
    },
    messages: {
      noAriaSlot: 'Aria attributes and the role attribute are not permitted on slots.',
    },
    fixable: null,
  },
  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (!element.sourceCodeLocation) {
                return; // probably a tree correction node
              }

              if (
                element.name === 'slot' &&
                Object.keys(element.attribs).some(a => a === 'role' || a.startsWith('aria'))
              ) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;

                if (loc) {
                  context.report({
                    loc,
                    messageId: 'noAriaSlot',
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

module.exports = ruleExtender(NoAriaSlot, HasLitHtmlImportRuleExtension);
