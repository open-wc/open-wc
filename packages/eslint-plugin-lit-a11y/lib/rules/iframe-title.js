/**
 * @fileoverview <iframe> elements must have a unique title property.
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
const IframeTitleRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '<iframe> elements must have a unique title property.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/iframe-title.md',
    },
    messages: {
      iframeTitle: '<iframe> elements must have a unique title property.',
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    /**
     * @param {import("parse5-htmlparser2-tree-adapter").Element} element
     */
    function isUntitledIframe(element) {
      return (
        element.name === 'iframe' && (!element.attribs.title || element.attribs.title === undefined)
      );
    }

    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (!element.sourceCodeLocation) {
                return; // probably a tree correction node
              }

              if (isUntitledIframe(element)) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;
                if (loc) {
                  context.report({ loc, messageId: 'iframeTitle' });
                }
              }
            },
          });
        }
      },
    };
  },
};

export default ruleExtender(IframeTitleRule, HasLitHtmlImportRuleExtension);
