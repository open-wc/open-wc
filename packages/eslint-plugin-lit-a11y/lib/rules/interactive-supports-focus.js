/**
 * @fileoverview
 * @author open-wc
 */

const includes = require('array-includes');
const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { eventHandlersByType } = require('../utils/eventsHandlers.js');
const { getAttrVal } = require('../utils/getAttrVal.js');
const { getTabIndex } = require('../utils/getTabIndex.js');
const { isDisabledElement } = require('../utils/isDisabledElement.js');
const { isHiddenFromScreenReader } = require('../utils/isHiddenFromScreenReader.js');
const { isInteractiveElement } = require('../utils/isInteractiveElement.js');
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
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
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
      TaggedTemplateExpression: node => {
        if (
          node.type === 'TaggedTemplateExpression' &&
          node.tag.type === 'Identifier' &&
          node.tag.name === 'html'
        ) {
          // const type = elementType(node);

          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement: element => {
              const hasInteractiveProps = Object.keys(element.attribs).some(attr =>
                interactiveProps.includes(attr),
              );
              const hasTabindex = getTabIndex(getAttrVal(element.attribs.tabindex)) !== undefined;

              if (
                !hasInteractiveProps &&
                isDisabledElement(element.attribs) &&
                isHiddenFromScreenReader(element.name, element.attribs) &&
                isPresentationRole(element.attribs)
              ) {
                // Presentation is an intentional signal from the author that this
                // element is not meant to be perceivable. For example, a click screen
                // to close a dialog.
                return;
              }

              if (
                hasInteractiveProps &&
                // && isInteractiveRole(element.name, attributes)
                !isInteractiveElement(element.name, element.attribs) &&
                // && !isNonInteractiveElement(element.name, attributes)
                // && !isNonInteractiveRole(element.name, attributes)
                !hasTabindex
              ) {
                const role = getAttrVal(element.attribs.role);
                if (includes(tabbable, role)) {
                  // Always tabbable, tabIndex = 0
                  context.report({
                    node,
                    message: `Elements with the '${role}' interactive role must be tabbable.`,
                  });
                } else {
                  // Focusable, tabIndex = -1 or 0
                  context.report({
                    node,
                    message: `Elements with the '${role}' interactive role must be focusable.`,
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
