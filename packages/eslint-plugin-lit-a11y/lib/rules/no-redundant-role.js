/**
 * @fileoverview Enforce explicit role property is not the same as implicit/default role property on element.
 * @author open-wc
 */

import ruleExtender from 'eslint-rule-extender';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { getImplicitRole } from '../utils/getImplicitRole.js';
import { getExplicitRole } from '../utils/getExplicitRole.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';
import { getContextSourceCode } from '../utils/getContextSourceCode.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const DEFAULT_ROLE_EXCEPTIONS = { nav: ['navigation'] };

/** @type {import("eslint").Rule.RuleModule} */
const NoRedundantRoleRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce explicit role property is not the same as implicit/default role property on element.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/no-redundant-role.md',
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
              if (!element.sourceCodeLocation) {
                return; // probably a tree correction node
              }

              const tagName = element.name;
              const implicitRole = getImplicitRole(tagName, element.attribs);
              const explicitRole = getExplicitRole(element.attribs);

              if (!implicitRole || !explicitRole) {
                return;
              }

              if (implicitRole === explicitRole) {
                const redundantRolesForElement = DEFAULT_ROLE_EXCEPTIONS[tagName] || [];

                if (redundantRolesForElement.includes(implicitRole)) {
                  return;
                }

                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;
                if (loc) {
                  context.report({
                    loc,
                    message: '"{{role}}" role is implicit in <{{tagName}}> element.',
                    data: {
                      role: explicitRole,
                      tagName,
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

export default ruleExtender(NoRedundantRoleRule, HasLitHtmlImportRuleExtension);
