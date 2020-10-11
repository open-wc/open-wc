/**
 * @fileoverview Enforce elements with aria-activedescendant are tabbable.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isInteractiveElement } = require('../utils/isInteractiveElement.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const AriaActiveDescendantHasTabindexRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce elements with aria-activedescendant are tabbable.',
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
            enterElement(element) {
              if (!Object.keys(element.attribs).includes('aria-activedescendant')) {
                return;
              }

              const { tabindex } = element.attribs;

              if (tabindex && tabindex.startsWith('{{')) {
                return;
              }

              // If this is an interactive element and the tabindex attribute is not specified,
              // or the tabIndex property was not mutated, then the tabIndex
              // property will be undefined.
              if (isInteractiveElement(element.name, element.attribs) && tabindex === undefined) {
                return;
              }

              if (parseInt(tabindex, 10) >= -1) {
                return;
              }

              const loc = analyzer.getLocationFor(element);
              context.report({
                loc,
                message: 'Elements with aria-activedescendant must be tabbable.',
              });
            },
          });
        }
      },
    };
  },
};

module.exports = AriaActiveDescendantHasTabindexRule;
