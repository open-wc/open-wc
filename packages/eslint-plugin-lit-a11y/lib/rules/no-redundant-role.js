/**
 * @fileoverview Enforce explicit role property is not the same as implicit/default role property on element.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { getImplicitRole } = require('../utils/getImplicitRole.js');
const { getExplicitRole } = require('../utils/getExplicitRole.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description:
        'Enforce explicit role property is not the same as implicit/default role property on element.',
      category: 'Fill me in',
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },
  // eslint-disable-next-line
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
        if (
          node.type === 'TaggedTemplateExpression' &&
          node.tag.type === 'Identifier' &&
          node.tag.name === 'html'
        ) {
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
