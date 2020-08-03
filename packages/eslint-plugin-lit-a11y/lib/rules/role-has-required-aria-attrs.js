/**
 * @fileoverview
 * @author open-wc
 */

const { roles } = require('aria-query');
const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description:
        'Enforce that elements with ARIA roles must have all required attributes for that role.',
      category: 'Fill me in',
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
        if (
          node.type === 'TaggedTemplateExpression' &&
          node.tag.type === 'Identifier' &&
          node.tag.name === 'html'
        ) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement: element => {
              // if element has a role attr
              if (Object.keys(element.attribs).includes('role')) {
                const { role } = element.attribs;
                // if the role is a valid/existing role
                if ([...roles.keys()].includes(role)) {
                  const requiredAriaAttributes = Object.keys(roles.get(role).requiredProps).sort();
                  const presentAriaAttributes = Object.keys(element.attribs)
                    .filter(attr => attr.startsWith('aria-'))
                    .sort();
                  const hasRequiredAriaAttributes = requiredAriaAttributes.every(
                    (attr, i) => attr === presentAriaAttributes[i],
                  );

                  if (!hasRequiredAriaAttributes) {
                    const loc = analyzer.getLocationFor(element);
                    context.report({
                      loc,
                      message: `Role '${role}' requires the following ARIA attribute(s): '${requiredAriaAttributes.join(
                        ', ',
                      )}'`,
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
