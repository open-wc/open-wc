/**
 * @fileoverview
 * @author open-wc
 */

import ruleExtender from 'eslint-rule-extender';
import { roles, aria } from 'aria-query';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isAriaPropertyName, isAriaRole } from '../utils/aria.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';
import { getContextSourceCode } from '../utils/getContextSourceCode.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const RoleSupportsAriaAttrRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce that elements with a defined role contain only supported ARIA attributes for that role.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/role-supports-aria-attrs.md',
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
              if (Object.keys(element.attribs).includes('role')) {
                /** @type {element['attribs'] & { role?: import("aria-query").ARIARole }} */
                const { role } = element.attribs;
                // if the role is a valid/existing role
                if (isAriaRole(role)) {
                  if (role.startsWith('{{')) return; // role is interpolated, assume its OK
                  const { props: propKeyValues } = roles.get(role);
                  const propertySet = Object.keys(propKeyValues);
                  const invalidAriaPropsForRole = [...aria.keys()].filter(
                    attribute => propertySet.indexOf(attribute) === -1,
                  );

                  Object.keys(element.attribs)
                    .filter(isAriaPropertyName)
                    .forEach(attr => {
                      if (invalidAriaPropsForRole.includes(attr)) {
                        const loc =
                          analyzer.getLocationForAttribute(
                            element,
                            attr,
                            getContextSourceCode(context),
                          ) ?? node.loc;
                        if (loc) {
                          context.report({
                            loc,
                            message: `The "{{role}}" role must not be used with the "${attr}" attribute.'`,
                            data: {
                              role,
                              attr,
                            },
                          });
                        }
                      }
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

export default ruleExtender(RoleSupportsAriaAttrRule, HasLitHtmlImportRuleExtension);
