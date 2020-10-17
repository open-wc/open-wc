/**
 * @fileoverview
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { elementHasAttribute, elementHasSomeAttribute } = require('../utils/elementHasAttribute.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

if (!('ListFormat' in Intl)) {
  /* eslint-disable global-require */
  // @ts-expect-error: since we allow node 10. Remove when we require node >= 12
  require('intl-list-format');
  // eslint-disable-next-line global-require
  // @ts-expect-error: since we allow node 10. Remove when we require node >= 12
  require('intl-list-format/locale-data/en');
  /* eslint-enable global-require */
}

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
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    // @ts-expect-error: since we allow node 10. Remove when we require node >= 12
    const formatter = new Intl.ListFormat('en', { style: 'long', type: 'disjunction' });

    /** These are the attributes which, if present, allow an element with role "img" to pass */
    const ALT_ATTRS = ['alt', 'aria-label', 'aria-labelledby'];

    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (
                element.name === 'img' &&
                element.attribs.role !== 'presentation' &&
                !elementHasAttribute(element, 'alt')
              ) {
                const loc = analyzer.getLocationFor(element);
                context.report({
                  loc,
                  message: '<img> elements must have an alt attribute.',
                });
              } else if (
                element.name !== 'img' &&
                element.attribs.role === 'img' &&
                !elementHasSomeAttribute(element, ALT_ATTRS)
              ) {
                const loc = analyzer.getLocationFor(element);
                context.report({
                  loc,
                  message: "elements with role '{{role}}' must have an {{attrs}} attribute.",
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

module.exports = AltTextRule;
