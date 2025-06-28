/**
 * @fileoverview Elements cannot use an invalid ARIA attribute.
 * @author open-wc
 */

import ruleExtender from 'eslint-rule-extender';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isInvalidAriaAttribute } from '../utils/aria.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';
import { getContextSourceCode } from '../utils/getContextSourceCode.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const AriaAttrsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Elements cannot use an invalid ARIA attribute.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/aria-attrs.md',
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
              for (const attr of Object.keys(element.attribs)) {
                if (isInvalidAriaAttribute(attr)) {
                  const loc =
                    analyzer.getLocationForAttribute(
                      element,
                      attr,
                      getContextSourceCode(context),
                    ) ?? node.loc;

                  if (loc) {
                    context.report({
                      loc,
                      message: 'Invalid ARIA attribute "{{attr}}".',
                      data: {
                        attr,
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

export default ruleExtender(AriaAttrsRule, HasLitHtmlImportRuleExtension);
