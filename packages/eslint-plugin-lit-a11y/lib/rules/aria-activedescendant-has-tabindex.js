/**
 * @fileoverview Enforce elements with aria-activedescendant are tabbable.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isInteractiveElement } = require('../utils/isInteractiveElement.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { hasLitHtmlImport, createValidLitHtmlSources } = require('../utils/utils.js');

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
              if (!Object.keys(element.attribs).includes('aria-activedescendant')) {
                return;
              }

              const { tabindex } = element.attribs;

              if (tabindex && tabindex.startsWith('{{')) {
                return; // tabindex is interpolated. ignore this node, assuming it's valid
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
