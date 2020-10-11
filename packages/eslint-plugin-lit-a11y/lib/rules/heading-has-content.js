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
              if (headings.includes(element.name)) {
                if (
                  hasAccessibleChildren(element) ||
                  isHiddenFromScreenReader(element.name, element.attribs)
                ) {
                  return;
                }

                const loc = analyzer.getLocationFor(element);

                const message = `<{{tagName}}> elements must have accessible content.`;

                const data = { tagName: element.name };

                context.report({ loc, message, data });
              }
            },
          });
        }
      },
    };
  },
};

module.exports = HeadingHasContentRule;
