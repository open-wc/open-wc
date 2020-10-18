/**
 * @fileoverview Enforce tabIndex value is not greater than zero.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { getAttrVal } = require('../utils/getAttrVal.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { hasLitHtmlImport, createValidLitHtmlSources } = require('../utils/utils.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const TabindexNoPositiveRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce tabIndex value is not greater than zero.',
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
              if (Object.keys(element.attribs).includes('tabindex')) {
                const val = getAttrVal(element.attribs.tabindex);

                if (val && val.startsWith('{{')) return;

                const value = Number(val);

                if (Number.isNaN(value)) {
                  const loc = analyzer.getLocationForAttribute(element, 'tabindex');
                  context.report({
                    loc,
                    message: `Invalid tabindex value {{val}}.`,
                    data: {
                      val,
                    },
                  });
                  return;
                }

                if (value > 0) {
                  const loc = analyzer.getLocationForAttribute(element, 'tabindex');
                  context.report({
                    loc,
                    message: `Avoid positive tabindex.`,
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

module.exports = TabindexNoPositiveRule;
