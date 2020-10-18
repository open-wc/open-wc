/**
 * @fileoverview aria-role
 * @author open-wc
 */

const { roles } = require('aria-query');
const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

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
              for (const [attr, rawValue] of Object.entries(element.attribs)) {
                if (attr !== 'role') {
                  return;
                }

                if (rawValue.startsWith('{{')) {
                  return; // the value is interpolated with a name. assume it's legitimate and move on.
                }

                if (
                  !validAriaRoles.includes(
                    /** @type {import("aria-query").ARIARoleDefintionKey} */ (rawValue),
                  )
                ) {
                  const loc = analyzer.getLocationForAttribute(element, attr);
                  context.report({
                    loc,
                    message: `Invalid role "{{rawValue}}".`,
                    data: {
                      rawValue,
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

module.exports = AriaRoleRule;
