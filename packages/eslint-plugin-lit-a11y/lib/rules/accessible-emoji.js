/**
 * @fileoverview Enforce emojis are wrapped in <span> and provide screenreader access.
 * @author open-wc
 */

import emojiRegex from 'emoji-regex';
import ruleExtender from 'eslint-rule-extender';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isTextNode } from '../utils/ast.js';
import { isHiddenFromScreenReader } from '../utils/isHiddenFromScreenReader.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';
import { getContextSourceCode } from '../utils/getContextSourceCode.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type{import('eslint').Rule.RuleModule} */
const AccessibleEmojiRule = {
  meta: {
    type: 'suggestion',
    deprecated: true,
    docs: {
      description: 'Enforce emojis are wrapped in <span> and provide screenreader access.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/accessible-emoji.md',
    },
    messages: {
      wrapEmoji:
        'Emojis must either be wrapped in <span role="img"> with a label, or hidden from the AOM.',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    /**
     * @param {import('parse5-htmlparser2-tree-adapter').Element} element
     * @return {boolean}
     */
    function hasEmojiTextContent(element) {
      const textNode = element.children.find(isTextNode);

      if (!textNode) return false;

      /** @type {RegExp} */
      // @ts-expect-error: 'emoji-regex' package declares its type with `export default`, but its actually CJS
      const EMOJI_REGEXP = emojiRegex();

      return EMOJI_REGEXP.test(textNode.data);
    }

    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (!hasEmojiTextContent(element)) {
                return; // element has no emoji text content
              }

              if (isHiddenFromScreenReader(element)) {
                return; // emoji is decorative
              }

              if (!element.sourceCodeLocation) {
                return; // probably a tree correction element
              }

              const rolePropValue = element.attribs.role;
              const ariaLabelProp = element.attribs['aria-label'];
              const ariaLabelledByProp = element.attribs['aria-labelledby'];
              const hasLabel = ariaLabelProp !== undefined || ariaLabelledByProp !== undefined;
              const isSpan = element.name === 'span';

              if (hasLabel === false || rolePropValue !== 'img' || isSpan === false) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;
                if (loc) {
                  context.report({ loc, messageId: 'wrapEmoji' });
                }
              }
            },
          });
        }
      },
    };
  },
};

export default ruleExtender(AccessibleEmojiRule, HasLitHtmlImportRuleExtension);
