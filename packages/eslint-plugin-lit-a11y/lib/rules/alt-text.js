/**
 * @fileoverview
 * @author open-wc
 */

import ruleExtender from 'eslint-rule-extender';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { elementHasAttribute, elementHasSomeAttribute } from '../utils/elementHasAttribute.js';
import { isHiddenFromScreenReader } from '../utils/isHiddenFromScreenReader.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';
import { getContextSourceCode } from '../utils/getContextSourceCode.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type{import('eslint').Rule.RuleModule} */
const AltTextRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Images require alt text',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/alt-text.md',
    },
    messages: {
      roleImgAttrs: "elements with role '{{role}}' must have an {{attrs}} attribute.",
      imgAttrs: '{{role}} elements must have an alt attribute.',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    // @ts-expect-error: since we allow node 10. Remove when we require node >= 12
    const formatter = new Intl.ListFormat('en', { style: 'long', type: 'disjunction' });

    /** These are the attributes which, if present, allow an element with role "img" to pass */
    const ALT_ATTRS = ['aria-label', 'aria-labelledby'];

    /**
     * Is the element an `<img>` with no `alt` attribute?
     * @param {import('parse5-htmlparser2-tree-adapter').Element} element
     * @return {boolean}
     */
    function isUnlabeledAOMImg(element) {
      return (
        element.name === 'img' &&
        element.attribs.role !== 'presentation' &&
        !isHiddenFromScreenReader(element) &&
        !elementHasAttribute(element, 'alt')
      );
    }

    /**
     * Is the element an `<input type="image">` with no `alt` attribute?
     * @param {import('parse5-htmlparser2-tree-adapter').Element} element
     * @return {boolean}
     */
    function isUnlabeledInputImg(element) {
      return (
        element.name === 'input' &&
        element.attribs.type === 'image' &&
        element.attribs.role !== 'presentation' &&
        !isHiddenFromScreenReader(element) &&
        !elementHasAttribute(element, 'alt')
      );
    }

    /**
     * Does the element an `img` role with no label?
     * @param {import('parse5-htmlparser2-tree-adapter').Element} element
     * @return {boolean}
     */
    function isUnlabeledImgRole(element) {
      return (
        element.name !== 'img' &&
        element.attribs.role === 'img' &&
        !isHiddenFromScreenReader(element) &&
        !elementHasSomeAttribute(element, ALT_ATTRS)
      );
    }

    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (!element.sourceCodeLocation) {
                return; // probably a tree correction element
              }

              const loc =
                analyzer.resolveLocation(
                  element.sourceCodeLocation.startTag,
                  getContextSourceCode(context),
                ) ?? node.loc;

              if (!loc) {
                return;
              }

              if (isUnlabeledAOMImg(element)) {
                context.report({ loc, messageId: 'imgAttrs', data: { role: '<img>' } });
              } else if (isUnlabeledInputImg(element)) {
                context.report({
                  loc,
                  messageId: 'imgAttrs',
                  data: { role: '<input type="image">' },
                });
              } else if (isUnlabeledImgRole(element)) {
                context.report({
                  loc,
                  messageId: 'roleImgAttrs',
                  data: {
                    role: 'img',
                    attrs: formatter.format(ALT_ATTRS),
                  },
                });
              }
            },
          });
        }
      },
    };
  },
};

export default ruleExtender(AltTextRule, HasLitHtmlImportRuleExtension);
