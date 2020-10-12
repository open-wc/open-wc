/**
 * @fileoverview <iframe> elements must have a unique title property.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const IframeTitleRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '<iframe> elements must have a unique title property.',
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
              if (
                element.name === 'iframe' &&
                (!Object.keys(element.attribs).includes('title') || element.attribs.title === '')
              ) {
                const loc = analyzer.getLocationFor(element);
                context.report({
                  loc,
                  message: '<iframe> elements must have a unique title property.',
                });
              }
            },
          });
        }
      },
    };
  },
};

module.exports = IframeTitleRule;
