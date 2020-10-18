/**
 * @fileoverview
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { elementHasAttribute, elementHasSomeAttribute } = require('../utils/elementHasAttribute.js');
const { elementIsHiddenFromScreenReader } = require('../utils/isHiddenFromScreenReader.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { hasLitHtmlImport, createValidLitHtmlSources } = require('../utils/utils.js');

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
    messages: {
      roleImgAttrs: "elements with role '{{role}}' must have an {{attrs}} attribute.",
      imgAttrs: '<img> elements must have an alt attribute.',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    let isLitHtml = false;
    const validLitHtmlSources = createValidLitHtmlSources(context);
    // @ts-expect-error: since we allow node 10. Remove when we require node >= 12
    const formatter = new Intl.ListFormat('en', { style: 'long', type: 'disjunction' });

    /** These are the attributes which, if present, allow an element with role "img" to pass */
    const ALT_ATTRS = ['aria-label', 'aria-labelledby'];

    /**
     * Is the element an `<img>` with no `alt` attribute?
     * @param {import('parse5-htmlparser2-tree-adapter').Element} element
     * @return {boolean}
     */
    function isUnlabeledAOMImg(element) {
      return (
        element.name === 'img' &&
        element.attribs.role !== 'presentation' &&
        !elementIsHiddenFromScreenReader(element) &&
        !elementHasAttribute(element, 'alt')
      );
    }

    /**
     * Does the element an `img` role with no label?
     * @param {import('parse5-htmlparser2-tree-adapter').Element} element
     * @return {boolean}
     */
    function isUnlabeledImgRole(element) {
      return (
        element.name !== 'img' &&
        element.attribs.role === 'img' &&
        !elementIsHiddenFromScreenReader(element) &&
        !elementHasSomeAttribute(element, ALT_ATTRS)
      );
    }

    return {
      ImportDeclaration(node) {
        if (hasLitHtmlImport(node, validLitHtmlSources)) {
          isLitHtml = true;
        }
      },
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node) && isLitHtml) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (isUnlabeledAOMImg(element)) {
                const loc = analyzer.getLocationFor(element);
                context.report({ loc, messageId: 'imgAttrs' });
              } else if (isUnlabeledImgRole(element)) {
                const loc = analyzer.getLocationFor(element);
                context.report({
                  loc,
                  messageId: 'roleImgAttrs',
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
