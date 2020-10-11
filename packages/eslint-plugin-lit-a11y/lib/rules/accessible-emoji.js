/**
 * @fileoverview Enforce emojis are wrapped in <span> and provide screenreader access.
 * @author open-wc
 */

const emojiRegex = require('emoji-regex');
const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isTextNode } = require('../../template-analyzer/util.js');
const { isHiddenFromScreenReader } = require('../utils/isHiddenFromScreenReader.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type{import('eslint').Rule.RuleModule} */
const AccessibleEmojiRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce emojis are wrapped in <span> and provide screenreader access.',
      category: 'Accessibility',
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
        if (isHtmlTaggedTemplate(node)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              // todo: figure out what is meant with literalChildValue, try to see from tests
              const literalChildValue = element.children.find(isTextNode);

              /** @type {RegExp} */
              // @ts-expect-error: 'emoji-regex' package declares its type with `export default`, but its actually CJS
              const EMOJI_REGEXP = emojiRegex();

              if (literalChildValue && EMOJI_REGEXP.test(literalChildValue.data)) {
                if (isHiddenFromScreenReader(element.name, element.attribs)) {
                  return; // emoji is decorative
                }
                const rolePropValue = element.attribs.role;
                const ariaLabelProp = element.attribs['aria-label'];
                const arialLabelledByProp = element.attribs['aria-labelledby'];
                const hasLabel = ariaLabelProp !== undefined || arialLabelledByProp !== undefined;
                const isSpan = element.name === 'span';

                if (hasLabel === false || rolePropValue !== 'img' || isSpan === false) {
                  const loc = analyzer.getLocationFor(element);
                  context.report({
                    loc,
                    message:
                      'Enforce emojis are wrapped in <span> and provide screenreader access.',
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

module.exports = AccessibleEmojiRule;
