/**
 * @fileoverview Enforce no accesskey attribute on element.
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
const NoAccessKeyRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce no accesskey attribute on element.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/no-access-key.md',
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
              if (Object.keys(element.attribs).includes('accesskey')) {
                const loc =
                  analyzer.getLocationForAttribute(
                    element,
                    'accesskey',
                    getContextSourceCode(context),
                  ) ?? node.loc;
                if (loc) {
                  context.report({
                    loc,
                    message: `Avoid using the accesskey attribute.`,
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

export default ruleExtender(NoAccessKeyRule, HasLitHtmlImportRuleExtension);
