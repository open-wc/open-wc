/**
 * @fileoverview Ensure all ordered and unordered lists (defined by ul or ol elements) contain only li content elements.
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

const LISTS = ['ul', 'ol'];
const ALLOWED_CHILDREN = ['li', 'template', 'script'];

/** @type {import("eslint").Rule.RuleModule} */
const ListRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Ensure all ordered and unordered lists (defined by ul or ol elements) contain only li content elements.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/list.md',
    },
    messages: {
      list: '<{{list}}> elements may only contain <li>, <template> or <script> elements.',
    },
    fixable: null,
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

              if (
                LISTS.includes(element.name) &&
                !element.children
                  .filter(c => c.type === 'tag')
                  .every(c => ALLOWED_CHILDREN.includes(c.name))
              ) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;

                const messageId = 'list';

                if (loc) {
                  context.report({ loc, messageId, data: { list: element.name } });
                }
              }
            },
          });
        }
      },
    };
  },
};

export default ruleExtender(ListRule, HasLitHtmlImportRuleExtension);
