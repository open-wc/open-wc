/**
 * @fileoverview Ensure all ordered and unordered lists (defined by ul or ol elements) contain only li content elements.
 * @author open-wc
 */

const ruleExtender = require('eslint-rule-extender');
const { TemplateAnalyzer } = require('eslint-plugin-lit/lib/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { HasLitHtmlImportRuleExtension } = require('../utils/HasLitHtmlImportRuleExtension.js');
const { getContextSourceCode } = require('../utils/getContextSourceCode.js');

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

module.exports = ruleExtender(ListRule, HasLitHtmlImportRuleExtension);
