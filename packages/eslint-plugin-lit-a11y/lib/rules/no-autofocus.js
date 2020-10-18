/**
 * @fileoverview
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { hasLitHtmlImport, createValidLitHtmlSources } = require('../utils/utils.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const NoAutofocusRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce that autoFocus prop is not used on elements.',
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
        if(hasLitHtmlImport(node, validLitHtmlSources)) {
          isLitHtml = true;
        }
      },
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node) && isLitHtml) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if ('autofocus' in element.attribs) {
                const loc = analyzer.getLocationForAttribute(element, 'autofocus');
                context.report({
                  loc,
                  message: 'The autofocus attribute is not allowed.',
                });
              }
            },
          });
        }
      },
    };
  },
};

module.exports = NoAutofocusRule;
