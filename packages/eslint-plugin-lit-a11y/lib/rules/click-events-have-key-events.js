/**
 * @fileoverview Enforce a clickable non-interactive element has at least 1 keyboard event listener.
 * @author open-wc
 */

import ruleExtender from 'eslint-rule-extender';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isIncludedInAOM } from '../utils/isIncludedInAOM.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { isNonInteractiveElement } from '../utils/isNonInteractiveElement.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';
import { getContextSourceCode } from '../utils/getContextSourceCode.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const ClickEventsHaveKeyEventsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'click-events-have-key-events',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/click-events-have-key-events.md',
    },
    messages: {
      clickableNonInteractiveElements:
        'Clickable non-interactive elements must have at least 1 keyboard event listener',
    },
    fixable: null,
    schema: [
      {
        allowList: {
          type: 'array',
          description:
            'list of tag names which are permitted to have click listeners without key listeners',
          default: [],
          uniqueItems: true,
          additionalItems: false,
          items: {
            type: 'string',
            pattern: '^[a-z]\\w+-\\w+',
          },
        },
        allowCustomElements: {
          type: 'boolean',
          description:
            'When true, permits all custom elements to have click listeners without key listeners',
          default: true,
        },
      },
    ],
  },

  create(context) {
    /**
     * @param {import("parse5-htmlparser2-tree-adapter").Element} element
     * @return {boolean}
     */
    function hasClickListener(element) {
      return Object.keys(element.attribs).includes('@click');
    }

    /**
     * @param {import("parse5-htmlparser2-tree-adapter").Element} element
     * @return {boolean}
     */
    function hasKeyboardListener(element) {
      const requiredProps = ['@keydown', '@keyup', '@keypress'];
      return Object.keys(element.attribs).some(attr => requiredProps.includes(attr));
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

              const options = (context.options && context.options[0]) || {};

              if (
                hasClickListener(element) &&
                !hasKeyboardListener(element) && // doesn't keyboard listeners
                isIncludedInAOM(element) &&
                isNonInteractiveElement(element, options)
              ) {
                const loc =
                  analyzer.resolveLocation(
                    element.sourceCodeLocation.startTag,
                    getContextSourceCode(context),
                  ) ?? node.loc;
                if (loc) {
                  context.report({ loc, messageId: 'clickableNonInteractiveElements' });
                }
              }
            },
          });
        }
      },
    };
  },
};

export default ruleExtender(ClickEventsHaveKeyEventsRule, HasLitHtmlImportRuleExtension);
