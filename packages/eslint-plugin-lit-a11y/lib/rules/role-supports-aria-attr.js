/**
 * @fileoverview
 * @author open-wc
 */

const { roles, aria } = require('aria-query');
const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isAriaPropertyName } = require('../utils/aria.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { hasLitHtmlImport, createValidLitHtmlSources } = require('../utils/utils.js');

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
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    let isLitHtml = false;
    const validLitHtmlSources = createValidLitHtmlSources(context);

    return {
      ImportDeclaration(node) {
        if (hasLitHtmlImport(node, validLitHtmlSources)) {
          isLitHtml = true;
        }
      },
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node) && isLitHtml) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (Object.keys(element.attribs).includes('role')) {
                /** @type {element['attribs'] & { role?: import("aria-query").ARIARole }} */
                const { role } = element.attribs;

                const { props: propKeyValues } = roles.get(role);
                const propertySet = Object.keys(propKeyValues);
                const invalidAriaPropsForRole = [...aria.keys()].filter(
                  attribute => propertySet.indexOf(attribute) === -1,
                );

                Object.keys(element.attribs)
                  .filter(isAriaPropertyName)
                  .forEach(attr => {
                    if (invalidAriaPropsForRole.includes(attr)) {
                      const loc = analyzer.getLocationForAttribute(element, attr);
                      context.report({
                        loc,
                        message: `The "{{role}}" role must not be used with the "${attr}" attribute.'`,
                        data: {
                          role,
                          attr,
                        },
                      });
                    }
                  });
              }
            },
          });
        }
      },
    };
  },
};

module.exports = RoleSupportsAriaAttrRule;
