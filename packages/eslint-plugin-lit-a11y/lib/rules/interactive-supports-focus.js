/**
 * @fileoverview
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { eventHandlersByType } = require('../utils/eventsHandlers.js');
const { getAttrVal } = require('../utils/getAttrVal.js');
const { getTabIndex } = require('../utils/getTabIndex.js');
const { isDisabledElement } = require('../utils/isDisabledElement.js');
const { isHiddenFromScreenReader } = require('../utils/isHiddenFromScreenReader.js');
const {
  isInteractiveElement,
  isNonInteractiveElement,
} = require('../utils/isInteractiveElement.js');
const { isInteractiveRole, isNonInteractiveRole } = require('../utils/isInteractiveRole.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { isPresentationRole } = require('../utils/isPresentationRole.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description:
        'Elements with an interactive role and interaction handlers (mouse or key press) must be focusable.',
      category: 'Fill me in',
      recommended: false,
    },
    messages: {
      elementWithRoleMustBe: "Elements with the '{{role}}' interactive role must be {{type}}.",
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        type: 'object',
        properties: {
          tabbable: {
            type: 'array',
            items: {
              type: 'string',
            },
            uniqueItems: true,
            additionalItems: false,
          },
        },
        required: ['tabbable'],
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const tabbable = (context.options && context.options[0] && context.options[0].tabbable) || [];
    const interactiveProps = [...eventHandlersByType.mouse, ...eventHandlersByType.keyboard];

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      TaggedTemplateExpression(node) {
        // 1. only target html`` tagged template literals
        if (isHtmlTaggedTemplate(node)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              // TODO: review this statement
              // if (!includes(domElements, type)) {
              //   // Do not test higher level JSX components, as we do not know what
              //   // low-level DOM element this maps to.
              //   return;
              // }

              const { attribs, name } = element;

              const hasInteractiveProps = Object.keys(attribs).some(attr =>
                interactiveProps.includes(attr),
              );

              if (
                !hasInteractiveProps ||
                isDisabledElement(attribs) ||
                isHiddenFromScreenReader(name, attribs) ||
                isPresentationRole(attribs)
              ) {
                // Presentation is an intentional signal from the author that this
                // element is not meant to be perceivable. For example, a click screen
                // to close a dialog.
                return;
              }

              const hasTabindex = getTabIndex(getAttrVal(attribs.tabindex)) !== undefined;

              if (
                hasInteractiveProps &&
                isInteractiveRole(attribs) &&
                !isInteractiveElement(name, attribs) &&
                !isNonInteractiveElement(name, attribs) &&
                !isNonInteractiveRole(name, attribs) &&
                !hasTabindex
              ) {
                const role = getAttrVal(attribs.role);

                if (tabbable.includes(role)) {
                  // Always tabbable, tabIndex = 0
                  context.report({
                    node,
                    messageId: 'elementWithRoleMustBe',
                    data: {
                      role,
                      type: 'tabbable',
                    },
                  });
                } else {
                  // Focusable, tabIndex = -1 or 0
                  context.report({
                    node,
                    messageId: 'elementWithRoleMustBe',
                    data: {
                      role,
                      type: 'focusable',
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
