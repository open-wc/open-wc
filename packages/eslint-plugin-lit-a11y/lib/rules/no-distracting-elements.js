/**
 * @fileoverview Enforce distracting elements are not used.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const distractingElements = ['blink', 'marquee'];

/** @type {import("eslint").Rule.RuleModule} */
const NoDistractingElementsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce distracting elements are not used.',
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
              if (distractingElements.includes(element.name)) {
                const loc = analyzer.getLocationFor(element);
                context.report({
                  loc,
                  message: `<{{tagName}}> elements are distracting and must not be used.`,
                  data: {
                    tagName: element.name,
                  },
                });
              }
            },
          });
        }
      },
    };
  },
};

module.exports = NoDistractingElementsRule;
