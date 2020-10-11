/**
 * @fileoverview Enforce heading (h1, h2, etc) elements contain accessible content.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { hasAccessibleChildren } = require('../utils/hasAccessibleChildren.js');
const { isHiddenFromScreenReader } = require('../utils/isHiddenFromScreenReader.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/** @type {import("eslint").Rule.RuleModule} */
const HeadingHasContentRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce heading (h1, h2, etc) elements contain accessible content.',
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
              if (headings.includes(element.name)) {
                if (hasAccessibleChildren(element)) {
                  return;
                }

                if (isHiddenFromScreenReader(element.name, element.attribs)) {
                  return;
                }

                const loc = analyzer.getLocationFor(element);
                context.report({
                  loc,
                  message: 'Heading (h1, h2, etc) elements must contain accessible content.',
                });
              }
            },
          });
        }
      },
    };
  },
};

module.exports = HeadingHasContentRule;
