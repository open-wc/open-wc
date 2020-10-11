// @ts-nocheck
/**
 * @fileoverview Ensure autocomplete attribute is correct.
 * @author open-wc
 */

const { runVirtualRule } = require('axe-core');
const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const AutocompleteValidRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure autocomplete attribute is correct.',
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
              if (
                element.name === 'input' &&
                element.attribs &&
                typeof element.attribs.autocomplete === 'string'
              ) {
                if (element.attribs.autocomplete.startsWith('{{')) {
                  return;
                }

                const { violations } = runVirtualRule('autocomplete-valid', {
                  nodeName: 'input',
                  attributes: {
                    autocomplete: element.attribs.autocomplete,
                    // Which autocomplete is valid depends on the input type
                    type: element.attribs.type === null ? undefined : element.attribs.type,
                  },
                });

                if (violations.length === 0) {
                  return;
                }

                const loc = analyzer.getLocationFor(element);
                context.report({
                  loc,
                  message: violations[0].nodes[0].all[0].message,
                });
              }
            },
          });
        }
      },
    };
  },
};

module.exports = AutocompleteValidRule;
