/**
 * @fileoverview Enforce elements with aria-activedescendant are tabbable.
 * @author open-wc
 */
import ruleExtender from 'eslint-rule-extender';
import { TemplateAnalyzer } from 'eslint-plugin-lit/lib/template-analyzer.js';
import { HasLitHtmlImportRuleExtension } from '../utils/HasLitHtmlImportRuleExtension.js';
import { isInteractiveElement } from '../utils/isInteractiveElement.js';
import { isHtmlTaggedTemplate } from '../utils/isLitHtmlTemplate.js';
import { getLiteralAttributeValue } from '../utils/getLiteralAttributeValue.js';
import { getContextSourceCode } from '../utils/getContextSourceCode.js';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const AriaActiveDescendantHasTabindexRule = {
  meta: {
    type: 'suggestion',
    messages: {
      ariaActiveDescendantHasTabindex: 'Elements with aria-activedescendant must be tabbable.',
    },
    docs: {
      description: 'Enforce elements with aria-activedescendant are tabbable.',
      category: 'Accessibility',
      recommended: false,
      url: 'https://github.com/open-wc/open-wc/blob/master/packages/eslint-plugin-lit-a11y/docs/rules/aria-activedescendant-has-tabindex.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node, context)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (!element.sourceCodeLocation) {
                return; // probably a tree correction node
              }

              if (!Object.keys(element.attribs).includes('aria-activedescendant')) return;

              const { tabindex } = element.attribs;

              // If this is an interactive element and the tabindex attribute is not specified,
              // or the tabIndex property was not mutated, then the tabIndex
              // property will be undefined.
              if (isInteractiveElement(element) && tabindex === undefined) return;

              const value = getLiteralAttributeValue(
                analyzer,
                element,
                'tabindex',
                getContextSourceCode(context),
              );

              if (tabindex && value === undefined) return;

              const tabIndex = typeof value === 'number' ? value : parseInt(`${value}`, 10);

              if (tabIndex >= -1) return;

              const loc =
                analyzer.resolveLocation(
                  element.sourceCodeLocation.startTag,
                  getContextSourceCode(context),
                ) ?? node.loc;

              if (loc) {
                context.report({ loc, messageId: 'ariaActiveDescendantHasTabindex' });
              }
            },
          });
        }
      },
    };
  },
};

export default ruleExtender(AriaActiveDescendantHasTabindexRule, HasLitHtmlImportRuleExtension);
