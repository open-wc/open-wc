/**
 * @fileoverview
 * @author open-wc
 */

const { roles, aria } = require('aria-query');
const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isAriaPropertyName } = require('../utils/aria.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

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
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      TaggedTemplateExpression: node => {
        if (isHtmlTaggedTemplate(node)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement: element => {
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
                        message: `Role '${role}' does not support usage of the '${attr}' ARIA attribute.'`,
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
