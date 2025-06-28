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

const UNSUPPORTED_ELEMENTS = ['meta', 'script', 'style'];

/** @type {import("eslint").Rule.RuleModule} */
const AriaUnsupportedElementsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Certain reserved DOM elements do not support ARIA roles, states and properties.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/aria-unsupported-elements.md',
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
              if (UNSUPPORTED_ELEMENTS.includes(element.name)) {
                for (const attr of Object.keys(element.attribs)) {
                  if (attr.startsWith('aria-') || attr === 'role') {
                    const loc =
                      analyzer.getLocationForAttribute(
                        element,
                        attr,
                        getContextSourceCode(context),
                      ) ?? node.loc;
                    if (loc) {
                      context.report({
                        loc,
                        message: `<{{tagName}}> element does not support ARIA roles, states, or properties.`,
                        data: {
                          tagName: element.name,
                        },
                      });
                    }
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

export default ruleExtender(AriaUnsupportedElementsRule, HasLitHtmlImportRuleExtension);
