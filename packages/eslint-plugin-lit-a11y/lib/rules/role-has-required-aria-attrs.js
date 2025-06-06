/**
 * @fileoverview
 * @author open-wc
 */

import ruleExtender from 'eslint-rule-extender';
import { roles } from 'aria-query';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isAriaRole } from '../utils/aria.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';
import { getContextSourceCode } from '../utils/getContextSourceCode.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const RoleHasRequiredAriaAttrsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce that elements with ARIA roles must have all required attributes for that role.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/role-has-required-aria-attrs.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    // @ts-expect-error: since we allow node 10. Remove when we require node >= 12
    const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (!element.sourceCodeLocation) {
                return; // probably a tree correction node
              }

              // if element has a role attr
              if (Object.keys(element.attribs).includes('role')) {
                const { role } = element.attribs;
                // if the role is a valid/existing role
                if (isAriaRole(role)) {
                  const requiredAriaAttributes = Object.keys(roles.get(role).requiredProps).sort();
                  const presentAriaAttributes = Object.keys(element.attribs)
                    .filter(attr => attr.startsWith('aria-'))
                    .sort();
                  const hasRequiredAriaAttributes = requiredAriaAttributes.every(attr =>
                    presentAriaAttributes.includes(attr),
                  );

                  if (!hasRequiredAriaAttributes) {
                    const loc =
                      analyzer.resolveLocation(
                        element.sourceCodeLocation.startTag,
                        getContextSourceCode(context),
                      ) ?? node.loc;
                    if (loc) {
                      context.report({
                        loc,
                        message: `The "{{role}}" role requires the {{plural}} {{requiredAttrs}}.`,
                        data: {
                          role,
                          plural: requiredAriaAttributes.length > 1 ? 'attributes' : 'attribute',
                          requiredAttrs: formatter.format(
                            requiredAriaAttributes.map(x => `"${x}"`),
                          ),
                        },
                      });
                    }
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

export default ruleExtender(RoleHasRequiredAriaAttrsRule, HasLitHtmlImportRuleExtension);
