/**
 * @fileoverview Enforce distracting elements are not used.
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

const BANNED_ELEMENTS = ['blink', 'marquee'];

/** @type {import("eslint").Rule.RuleModule} */
const NoDistractingElementsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce distracting elements are not used.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/no-distracting-elements.md',
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

              if (BANNED_ELEMENTS.includes(element.name)) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;
                if (loc) {
                  context.report({
                    loc,
                    message: `<{{tagName}}> elements are distracting and must not be used.`,
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

export default ruleExtender(NoDistractingElementsRule, HasLitHtmlImportRuleExtension);
