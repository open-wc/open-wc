/**
 * @fileoverview Enforce a clickable non-interactive element has at least 1 keyboard event listener.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHiddenFromScreenReader } = require('../utils/isHiddenFromScreenReader.js');
const { isInteractiveElement } = require('../utils/isInteractiveElement.js');
const { isPresentationRole } = require('../utils/isPresentationRole.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'click-events-have-key-events',
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

    // any helper functions should go here or else delete this section

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
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (!Object.keys(element.attribs).includes('@click')) {
                return;
              }

              const requiredProps = ['@keydown', '@keyup', '@keypress'];

              if (
                isHiddenFromScreenReader(element.name, element.attribs) ||
                isPresentationRole(element.name, element.attribs)
              ) {
                return;
              }

              if (isInteractiveElement(element.name, element.attribs)) {
                return;
              }

              if (Object.keys(element.attribs).some(attr => requiredProps.includes(attr))) {
                return;
              }

              if (
                (Object.keys(element.attribs).includes('aria-hidden') &&
                  element.attribs['aria-hidden'] === 'true') ||
                (element.attribs['aria-hidden'] &&
                  element.attribs['aria-hidden'].startsWith('{{')) ||
                element.attribs['aria-hidden'] === ''
              ) {
                return;
              }

              const loc = analyzer.getLocationFor(element);
              context.report({
                loc,
                message:
                  'Clickable non-interactive elements must have at least 1 keyboard event listener',
              });
            },
          });
        }
      },
    };
  },
};
