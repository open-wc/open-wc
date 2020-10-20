/**
 * @fileoverview aria-role
 * @author open-wc
 */

const ruleExtender = require('eslint-rule-extender');
const { roles } = require('aria-query');
const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { HasLitHtmlImportRuleExtension } = require('../utils/HasLitHtmlImportRuleExtension.js');
const { getExpressionValue } = require('../utils/getExpressionValue.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const validAriaRoles = [...roles.keys()].filter(role => roles.get(role).abstract === false);

/** @type {import("eslint").Rule.RuleModule} */
const AriaRoleRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'aria-role',
      category: 'Accessibility',
      recommended: false,
      url:
        'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/aria-role.md',
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
              for (const [attr, rawValue] of Object.entries(element.attribs)) {
                if (attr !== 'role') {
                  return;
                }

                const val = getExpressionValue(analyzer, rawValue);

                if (!val && rawValue.startsWith('{{')) {
                  return; // the value is interpolated with a name. assume it's legitimate and move on.
                }

                if (
                  !validAriaRoles.includes(
                    /** @type {import("aria-query").ARIARoleDefintionKey} */ (val || rawValue),
                  )
                ) {
                  const loc = analyzer.getLocationForAttribute(element, attr);
                  context.report({
                    loc,
                    message: `Invalid role "{{val}}".`,
                    data: {
                      val: val || rawValue,
                    },
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

module.exports = ruleExtender(AriaRoleRule, HasLitHtmlImportRuleExtension);
