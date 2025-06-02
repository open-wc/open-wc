/**
 * @fileoverview Ensures that every object element has a text alternative
 * @author open-wc
 */

import ruleExtender from 'eslint-rule-extender';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { hasAccessibleName } from '../utils/hasAccessibleName.js';
import { isHiddenFromScreenReader } from '../utils/isHiddenFromScreenReader.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';
import { getContextSourceCode } from '../utils/getContextSourceCode.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type{import('eslint').Rule.RuleModule} */
const ObjAlt = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensures that every object element has a text alternative.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/obj-alt.md',
    },
    messages: {
      alt: '<obj> elements must have an alt attribute.',
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
                return; // probably a tree correction element
              }

              if (
                element.name === 'object' &&
                !hasAccessibleName(element) &&
                !isHiddenFromScreenReader(element) &&
                !Object.entries(element.attribs).some(
                  ([name, value]) => name === 'role' && ['presentation', 'none'].includes(value),
                )
              ) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;

                if (loc) {
                  context.report({
                    loc,
                    messageId: 'alt',
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

export default ruleExtender(ObjAlt, HasLitHtmlImportRuleExtension);
