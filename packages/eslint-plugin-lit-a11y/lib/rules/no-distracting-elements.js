/**
 * @fileoverview Enforce distracting elements are not used.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { hasLitHtmlImport, createValidLitHtmlSources } = require('../utils/utils.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const BANNED_ELEMENTS = ['blink', 'marquee'];

/** @type {import("eslint").Rule.RuleModule} */
const NoDistractingElementsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce distracting elements are not used.',
      category: 'Accessibility',
      recommended: false,
      url:
        'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/no-distracting-elements.md',
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    let isLitHtml = false;
    const validLitHtmlSources = createValidLitHtmlSources(context);

    return {
      ImportDeclaration(node) {
        if (hasLitHtmlImport(node, validLitHtmlSources)) {
          isLitHtml = true;
        }
      },
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node) && isLitHtml) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (BANNED_ELEMENTS.includes(element.name)) {
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
