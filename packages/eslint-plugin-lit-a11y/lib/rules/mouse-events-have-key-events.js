/**
 * @fileoverview Enforce @mouseover/@mouseout are accompanied by @focus/@blur.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

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
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              const { attribs } = element;
              // Check @mouseover / @focus pairing.
              const hasMouseoverHandler = Object.keys(attribs).includes('@mouseover');
              const mouseoverHandlerValue = attribs['@mouseover'];

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
                    message: '@mouseover must be accompanied by @focus.',
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
                    message: '@mouseout must be accompanied by @blur.',
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

module.exports = MouseEventsHaveKeyEventsRule;
