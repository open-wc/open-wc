/**
 * @fileoverview Enforce @mouseover/@mouseout are accompanied by @focus/@blur.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'mouse-events-have-key-events',
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
              const { attribs } = element;
              // Check onmouseover / onfocus pairing.
              const onMouseOver = Object.keys(attribs).includes('@mouseover');
              const onMouseOverValue = attribs['@mouseover'];

              if (onMouseOver && onMouseOverValue != null) {
                const hasOnFocus = Object.keys(attribs).includes('@focus');
                const onFocusValue = attribs['@focus'];

                if (hasOnFocus === false || onFocusValue === null || onFocusValue === undefined) {
                  context.report({
                    node,
                    message: '@mouseover must be accompanied by @focus for accessibility.',
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
                    message: '@mouseout must be accompanied by @blur for accessibility.',
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
