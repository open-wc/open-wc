/**
 * @fileoverview Enforce usage of @blur over @change with <select> and <option>.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { hasLitHtmlImport, createValidLitHtmlSources } = require('../utils/utils.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const applicableTypes = ['select', 'option'];

/** @type {import("eslint").Rule.RuleModule} */
const NoInvalidChangeHandlerRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce usage of @blur over @change with <select> and <option>.',
      category: 'Accessibility',
      recommended: false,
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
              if (applicableTypes.includes(element.name)) {
                const change = Object.keys(element.attribs).includes('@change');
                const blur = Object.keys(element.attribs).includes('@blur');

                if (change && !blur) {
                  const loc = analyzer.getLocationFor(element);
                  context.report({
                    loc,
                    message: `@blur must be used instead of @change on <{{tagName}}>, unless absolutely necessary and it causes no negative consequences for keyboard only or screen reader users.`,
                    data: {
                      tagName: element.name,
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

module.exports = NoInvalidChangeHandlerRule;
