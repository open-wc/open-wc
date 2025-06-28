/**
 * @fileoverview aria-role
 * @author open-wc
 */

import ruleExtender from 'eslint-rule-extender';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';
import { isConcreteAriaRole } from '../utils/aria.js';
import { getLiteralAttributeValue } from '../utils/getLiteralAttributeValue.js';
import { getContextSourceCode } from '../utils/getContextSourceCode.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const AriaRoleRule = {
  meta: {
    type: 'suggestion',
    messages: {
      invalidRole: 'Invalid role "{{role}}".',
    },
    docs: {
      description: 'aria-role',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/aria-role.md',
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
              for (const attr of Object.keys(element.attribs)) {
                if (attr !== 'role') return;

                const role = getLiteralAttributeValue(
                  analyzer,
                  element,
                  'role',
                  getContextSourceCode(context),
                );

                if (role === undefined) return;

                if (!isConcreteAriaRole(role)) {
                  const loc =
                    analyzer.getLocationForAttribute(
                      element,
                      attr,
                      getContextSourceCode(context),
                    ) ?? node.loc;
                  if (loc) {
                    context.report({
                      loc,
                      messageId: 'invalidRole',
                      data: {
                        role,
                      },
                    });
                  }
                }
              }
            },
          });
        }
      },
    };
  },
};

export default ruleExtender(AriaRoleRule, HasLitHtmlImportRuleExtension);
