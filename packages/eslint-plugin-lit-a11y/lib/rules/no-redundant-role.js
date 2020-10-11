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
              const implicitRole = getImplicitRole(element.name, element.attribs);
              const explicitRole = getExplicitRole(element.attribs);

              if (implicitRole === explicitRole) {
                const loc = analyzer.getLocationFor(element);
                context.report({
                  loc,
                  message:
                    'Enforce explicit role property is not the same as implicit/default role property on element',
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
