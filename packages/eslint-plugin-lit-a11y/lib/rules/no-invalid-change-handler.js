/**
 * @fileoverview Enforce usage of @blur over @change with <select> and <option>.
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

const applicableTypes = ['select', 'option'];

/** @type {import("eslint").Rule.RuleModule} */
const NoInvalidChangeHandlerRule = {
  meta: {
    type: 'suggestion',
    deprecated: true,
    docs: {
      description: 'Enforce usage of @blur over @change with <select> and <option>.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/no-invalid-change-handler.md',
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
              if (!element.sourceCodeLocation) {
                return; // probably a tree correction node
              }

              if (applicableTypes.includes(element.name)) {
                const change = Object.keys(element.attribs).includes('@change');
                const blur = Object.keys(element.attribs).includes('@blur');

                if (change && !blur) {
                  const loc =
                    analyzer.resolveLocation(
                      element.sourceCodeLocation.startTag,
                      getContextSourceCode(context),
                    ) ?? node.loc;
                  if (loc) {
                    context.report({
                      loc,
                      message: `@blur must be used instead of @change on <{{tagName}}>, unless absolutely necessary and it causes no negative consequences for keyboard only or screen reader users.`,
                      data: {
                        tagName: element.name,
                      },
                    });
                  }
                }
              }
            },
          });
        }
      },
    };
  },
};

export default ruleExtender(NoInvalidChangeHandlerRule, HasLitHtmlImportRuleExtension);
