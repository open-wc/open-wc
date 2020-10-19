/**
 * @fileoverview
 * @author open-wc
 */

const { getAttrVal, getExpressionValue } = require('../utils/getAttrVal.js');
const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { isAriaHidden } = require('../utils/aria.js');
const { elementHasAttribute } = require('../utils/elementHasAttribute.js');
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

const DEFAULT_KEYWORDS = ['image', 'picture', 'photo'];

/** @type {import("eslint").Rule.RuleModule} */
const ImgRedundantAltRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce img alt attribute does not contain the word image, picture, or photo.',
      category: 'Accessibility',
      recommended: false,
    },
    messages: {
      imgRedundantAlt:
        '<img> alt attribute must be descriptive; it cannot contain the banned {{plural}} {{formatted}}.',
    },
    fixable: null,
    schema: [
      {
        keywords: {
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
    // @ts-expect-error: since we allow node 10. Remove when we require node >= 12
    const formatter = new Intl.ListFormat('en', { style: 'long', type: 'disjunction' });
    let isLitHtml = false;
    const validLitHtmlSources = createValidLitHtmlSources(context);

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
              if (
                element.name !== 'img' ||
                !elementHasAttribute(element, 'alt') ||
                isAriaHidden(element)
              ) {
                return;
              }

              const optionsKeywords =
                (context.options && context.options[0] && context.options[0].keywords) || [];

              const bannedKeywords = [...DEFAULT_KEYWORDS, ...optionsKeywords];

              const contraband = bannedKeywords.filter(keyword => {
                  const val = getExpressionValue(analyzer, element.attribs.alt) || getAttrVal(element.attribs.alt)
                  return val.toLowerCase().includes(keyword.toLowerCase());
                }
              );

              if (contraband.length > 0) {
                const banned = formatter.format(contraband);
                const loc = analyzer.getLocationForAttribute(element, 'alt');

                context.report({
                  loc,
                  messageId: 'imgRedundantAlt',
                  data: {
                    formatted: banned,
                    plural: contraband.length > 1 ? 'words' : 'word',
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

module.exports = ImgRedundantAltRule;
