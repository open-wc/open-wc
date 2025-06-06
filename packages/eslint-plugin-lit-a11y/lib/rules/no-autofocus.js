/**
 * @fileoverview
 * @author open-wc
 */

import ruleExtender from 'eslint-rule-extender';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';
import { getContextSourceCode } from '../utils/getContextSourceCode.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const NoAutofocusRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce that autofocus attribute or property are not used on elements.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/no-autofocus.md',
    },
    messages: {
      noAutofocus: 'The autofocus {{type}} is not allowed.',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if ('autofocus' in element.attribs) {
                const loc =
                  analyzer.getLocationForAttribute(
                    element,
                    'autofocus',
                    getContextSourceCode(context),
                  ) ?? node.loc;
                if (loc) {
                  context.report({
                    loc,
                    messageId: 'noAutofocus',
                    data: { type: 'attribute' },
                  });
                }
              }
              if ('.autofocus' in element.attribs) {
                const loc =
                  analyzer.getLocationForAttribute(
                    element,
                    '.autofocus',
                    getContextSourceCode(context),
                  ) ?? node.loc;
                if (loc) {
                  context.report({
                    loc,
                    messageId: 'noAutofocus',
                    data: { type: 'property' },
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

export default ruleExtender(NoAutofocusRule, HasLitHtmlImportRuleExtension);
