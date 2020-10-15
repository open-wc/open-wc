/**
 * @fileoverview Enforce explicit role property is not the same as implicit/default role property on element.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { getImplicitRole } = require('../utils/getImplicitRole.js');
const { getExplicitRole } = require('../utils/getExplicitRole.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

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
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node)) {
          const analyzer = TemplateAnalyzer.create(node);
          analyzer.traverse({
            enterElement(element) {
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

                const loc = analyzer.getLocationFor(element);
                context.report({
                  loc,
                  message: '"{{role}}" role is implicit in <{{tagName}}> element.',
                  data: {
                    role: explicitRole,
                    tagName,
                  },
                });
              }
            },
          });
        }
      },
    };
  },
};

module.exports = NoRedundantRoleRule;
