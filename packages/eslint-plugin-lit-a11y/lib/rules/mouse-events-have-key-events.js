/**
 * @fileoverview Enforce @mouseover/@mouseout are accompanied by @focus/@blur.
 * @author open-wc
 */

import ruleExtender from 'eslint-rule-extender';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { isIncludedInAOM } from '../utils/isIncludedInAOM.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { isNonInteractiveElement } from '../utils/isNonInteractiveElement.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const MouseEventsHaveKeyEventsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'mouse-events-have-key-events',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/mouse-events-have-key-events.md',
    },
    messages: {
      mouseEventsHaveKeyEvents: '@{{mouseevent}} must be accompanied by @{{keyevent}}',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowList: {
            type: 'array',
            description:
              'list of tag names which are permitted to have mouse event listeners without key listeners',
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
              'When true, permits all custom elements to have mouse event listeners without key listeners',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              const { attribs } = element;
              // Check @mouseover / @focus pairing.
              const hasMouseoverHandler = Object.keys(attribs).includes('@mouseover');
              const mouseoverHandlerValue = attribs['@mouseover'];

              const options = (context.options && context.options[0]) || {};

              if (!isIncludedInAOM(element) || !isNonInteractiveElement(element, options)) return;

              if (hasMouseoverHandler && mouseoverHandlerValue != null) {
                const hasFocusHandler = Object.keys(attribs).includes('@focus');
                const focusHandlerValue = attribs['@focus'];

                if (
                  hasFocusHandler === false ||
                  focusHandlerValue === null ||
                  focusHandlerValue === undefined
                ) {
                  context.report({
                    node,
                    messageId: 'mouseEventsHaveKeyEvents',
                    data: {
                      mouseevent: 'mouseover',
                      keyevent: 'focus',
                    },
                  });
                }
              }

              // Checkout onmouseout / onblur pairing
              const onMouseOut = Object.keys(attribs).includes('@mouseout');
              const onMouseOutValue = attribs['@mouseout'];
              if (onMouseOut && onMouseOutValue != null) {
                const hasOnBlur = Object.keys(attribs).includes('@blur');
                const onBlurValue = attribs['@blur'];

                if (hasOnBlur === false || onBlurValue === null || onBlurValue === undefined) {
                  context.report({
                    node,
                    messageId: 'mouseEventsHaveKeyEvents',
                    data: {
                      mouseevent: 'mouseout',
                      keyevent: 'blur',
                    },
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

export default ruleExtender(MouseEventsHaveKeyEventsRule, HasLitHtmlImportRuleExtension);
