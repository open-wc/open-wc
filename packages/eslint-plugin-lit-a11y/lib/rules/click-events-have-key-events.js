/**
 * @fileoverview Enforce a clickable non-interactive element has at least 1 keyboard event listener.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isAriaHidden } = require('../utils/aria.js');
const { isHiddenFromScreenReader } = require('../utils/isHiddenFromScreenReader.js');
const { isInteractiveElement } = require('../utils/isInteractiveElement.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { isPresentationRole } = require('../utils/isPresentationRole.js');

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
    },
    fixable: null,
    schema: [
      {
        allowList: {
          type: 'array',
          items: {
            type: 'string',
          },
          uniqueItems: true,
          additionalItems: false,
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
        if (isHtmlTaggedTemplate(node)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              const allowListOptions =
                (context.options && context.options[0] && context.options[0].allowList) || [];

              if (
                !hasClickListener(element) || // not clickable
                isHiddenFromScreenReader(element.name, element.attribs) || // excluded from AOM
                isPresentationRole(element.attribs) || // excluded from AOM
                isAriaHidden(element) || // excluded from AOM
                hasKeyboardListener(element) || // has keyboard listeners
                isInteractiveElement(element.name, element.attribs) || // keyboard-accesible by default
                allowListOptions.includes(element.name) // button-like custom-elements allow list
              ) {
                return;
              }

              const loc = analyzer.getLocationFor(element);

              const message =
                'Clickable non-interactive elements must have at least 1 keyboard event listener';

              context.report({ loc, message });
            },
          });
        }
      },
    };
  },
};

module.exports = ClickEventsHaveKeyEventsRule;
