/**
 * @fileoverview Ensure all definition lists (defined by dl elements) contain only properly-ordered dt and dd groups, div, script, or template elements.
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

const LIST = 'dl';
const ALLOWED_CHILDREN = ['dt', 'dd', 'div', 'script', 'template'];

/** @type {import("eslint").Rule.RuleModule} */
const DefinitionListRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Ensure all definition lists (defined by dl elements) contain only properly-ordered dt and dd groups, div, script, or template elements.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/definition-list.md',
    },
    messages: {
      list: '<dl> elements may only contain properly-ordered <dt> and <dd> groups, <div>, <script>, or <template> elements.',
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

              if (element.name === LIST) {
                if (
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
              }
            },
          });
        }
      },
    };
  },
};

export default ruleExtender(DefinitionListRule, HasLitHtmlImportRuleExtension);
