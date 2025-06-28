// @ts-nocheck
/**
 * @fileoverview Ensure autocomplete attribute is correct.
 * @author open-wc
 */

import ruleExtender from 'eslint-rule-extender';
import axe from 'axe-core';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';
import { getContextSourceCode } from '../utils/getContextSourceCode.js';

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
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/autocomplete-valid.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    /**
     * @param {import('parse5-htmlparser2-tree-adapter').Element} element
     */
    function isInputElementWithAutoComplete(element) {
      return (
        element.name === 'input' &&
        element.attribs &&
        typeof element.attribs.autocomplete === 'string'
      );
    }

    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (!element.sourceCodeLocation) {
                return; // probably a tree correction node
              }

              if (isInputElementWithAutoComplete(element)) {
                if (element.attribs.autocomplete.startsWith('{{')) {
                  return; // autocomplete is interpolated. assume it's legit and move on.
                }

                const { violations } = axe.runVirtualRule('autocomplete-valid', {
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

                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;
                if (loc) {
                  context.report({
                    loc,
                    message: violations[0].nodes[0].all[0].message,
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

export default ruleExtender(AutocompleteValidRule, HasLitHtmlImportRuleExtension);
